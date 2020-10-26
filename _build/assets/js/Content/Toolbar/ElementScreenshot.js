import ToolbarPlugin from "./ToolbarPlugin";
import fredConfig from "../../Config";
import {img, div, input, span, i} from "../../UI/Elements";
import Modal from "../../Modal";
import emitter from "../../EE";
import {replaceImage} from "../../Actions/elements";
import cache from "../../Cache";

const IMAGE_MIME_REGEX = /^image\/(jpe?g|png)$/i;
const maxWidth = 540;

export default class ElementScreenshot extends ToolbarPlugin {
    static permission = 'fred_element_screenshot';
    static title = 'fred.fe.content.element_screenshot';
    static icon = 'fred--element_screenshot';

    onClick() {
        if (!fredConfig.permission.fred_element_screenshot) return;

        let dataImage = '';

        const loadImage = (file) => {
            const reader = new FileReader();
            reader.onload = function(e){
                const image = new Image();
                image.src = e.target.result;

                image.onload = () => {
                    if (image.width > maxWidth) {
                        const ratio = maxWidth / image.width;

                        const resizedCanvas = document.createElement("canvas");
                        const ctx = resizedCanvas.getContext("2d");

                        resizedCanvas.width = image.width * ratio;
                        resizedCanvas.height = image.height * ratio;

                        ctx.drawImage(image, 0, 0, resizedCanvas.width, resizedCanvas.height);

                        dataImage = resizedCanvas.toDataURL();
                    } else {
                        dataImage = e.target.result;
                    }

                    dropArea.innerHTML = '';
                    dropArea.appendChild(img(dataImage));
                    modal.enableSave();
                };
            };
            reader.readAsDataURL(file);
        };

        const {dropArea, wrapper, pasteHandler} = this.createDropArea(loadImage);

        const modal = new Modal('fred.fe.content.element_screenshot', '', () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.content.element_replacing_thumbnail'));
            document.removeEventListener('paste', pasteHandler);

            replaceImage(this.el.id, dataImage).then(() => {
                cache.kill('elements', {name: 'elements'});
                emitter.emit('fred-loading-hide');
            });
        }, {showCancelButton: true, saveButtonText: 'fred.fe.content.replace_element_thumbnail'}, () => {
            document.removeEventListener('paste', pasteHandler);
        });

        modal.setContent(wrapper);
        modal.render();
        modal.disableSave();

    }

    createDropArea(loadImage) {
        const dropArea = div('', [i(), span([], 'fred.fe.content.element_screenshot_text')]);
        const fileInput = input('', 'file');
        const wrapper = div('fred--element_screenshot_upload_wrapper', [fileInput, dropArea]);

        const pasteHandler = (e) => {
            e.preventDefault();
            var items = e.clipboardData.items;

            for (var i = 0; i < items.length; i++) {
                if (IMAGE_MIME_REGEX.test(items[i].type)) {
                    loadImage(items[i].getAsFile());
                    return;
                }
            }
        };
        const handleFiles = (files) => {
            for (var i = 0; i < files.length; i++) {

                // get the next file that the user selected
                var file = files[i];
                var imageType = /image.*/;

                // don't try to process non-images
                if (!file.type.match(imageType)) {
                    continue;
                }

                loadImage(file);
                break;
            }
        }

        fileInput.setAttribute('accept', 'image/*');
        fileInput.addEventListener("change", (e) => {
            handleFiles(e.target.files);
        }, false);

        dropArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropArea.classList.add('over');
        });
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropArea.classList.add('over');
        });
        dropArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropArea.classList.remove('over');
        });
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer.files;
            dropArea.classList.remove('over');

            handleFiles(files);
        });
        dropArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            fileInput.click();
        });

        document.addEventListener('paste', pasteHandler);

        return {
            dropArea,
            pasteHandler,
            wrapper
        };
    }
}
