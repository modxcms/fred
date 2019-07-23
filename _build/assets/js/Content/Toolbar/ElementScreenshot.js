import ToolbarPlugin from "./ToolbarPlugin";
import fredConfig from "../../Config";
import {img, span} from "../../UI/Elements";
import Modal from "../../Modal";
import emitter from "../../EE";
import {replaceImage} from "../../Actions/elements";
import cache from "../../Cache";
import html2canvas from "html2canvas";

export default class ElementScreenshot extends ToolbarPlugin {
    static permission = 'fred_element_screenshot';
    static title = 'fred.fe.content.element_screenshot';
    static icon = 'fred--element_screenshot';

    onClick() {
        if (!fredConfig.permission.fred_element_screenshot) return;

        let dataImage = '';

        const modal = new Modal('Element Screenshot', '', () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.content.element_replacing_thumbnail'));

            replaceImage(this.el.id, dataImage).then(() => {
                cache.kill('elements', {name: 'elements'});
                emitter.emit('fred-loading-hide');
            });
        }, {showCancelButton: true, saveButtonText: 'fred.fe.content.replace_element_thumbnail'});

        const loader = span(['fred--loading']);
        modal.setContent(loader);
        modal.render();
        modal.disableSave();

        html2canvas(this.el.wrapper, {
            logging: false,
            ignoreElements: el => {
                if (el.classList.contains('fred')) return true;
                if (el.classList.contains('fred--toolbar')) return true;
                if (el.classList.contains('fred--block_title')) return true;

                return false;
            }
        }).then(canvas => {
            const maxWidth = 540;

            if (canvas.width > maxWidth) {
                const ratio = maxWidth / canvas.width;
                const image = new Image();

                image.onload = () => {
                    const resizedCanvas = document.createElement("canvas");
                    const ctx = resizedCanvas.getContext("2d");

                    resizedCanvas.width = canvas.width * ratio;
                    resizedCanvas.height = canvas.height * ratio;

                    ctx.drawImage(image, 0, 0, resizedCanvas.width, resizedCanvas.height);

                    dataImage = resizedCanvas.toDataURL();

                    modal.setContent(img(dataImage));
                    modal.enableSave();
                };

                image.src = canvas.toDataURL();
            } else {
                dataImage = canvas.toDataURL();

                modal.setContent(img(dataImage));
                modal.enableSave();
            }
        })
            .catch(err => {
                modal.setContent(img('https://via.placeholder.com/300x150/000000/FF0000?text=Generation%20Failed'));
            });
    }
}
