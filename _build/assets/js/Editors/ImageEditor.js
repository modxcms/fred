import Editor from './Editor';
import Finder from '../Finder';

export default class ImageEditor extends Editor {
    static title = 'Edit Image';

    init() {
        this.state = {
            ...(this.state),
            src: (this.el.src || '')
        }
    }

    render() {
        const wrapper = document.createElement('div');

        wrapper.appendChild(this.ui.buildTextInput({
            name: 'src',
            label: 'Image URI'
        }, this.state.src, this.setStateValue, (setting, label, input) => {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('fred--input-group', 'fred--browse');
            
            const openFinder = document.createElement('a');
            openFinder.classList.add('fred--browse-small');
            openFinder.setAttribute('title', 'Browse');

            openFinder.addEventListener('click', e => {
                e.preventDefault();

                this.openFinder(input);
            });

            inputWrapper.appendChild(input);
            inputWrapper.appendChild(openFinder);
            
            label.appendChild(inputWrapper);
        }));

        wrapper.appendChild(this.buildAttributesFields());

        return wrapper;
    }

    openFinder(input) {
        const finder = new Finder(`${this.config.assetsUrl}elfinder/index.html`, (file, fm) => {
            this.setStateValue('src', file.url);
            input.value = file.url;
        }, 'Browse Images', Finder.getFinderOptions(this.el, true));

        finder.render();
    }

    onSave() {
        Editor.prototype.onSave.call(this);
        this.el.src = this.state.src;
    }
}