import emitter from './EE';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default class Fred {
    constructor(config = {}) {
        this.init();
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred');

        this.wrapper.addEventListener('click', e => {
            e.stopPropagation();
        });

        new Topbar(this.wrapper);
        new Sidebar(this.wrapper);

        if (document.body.firstChild === null) {
            document.body.appendChild(this.wrapper);
        } else {
            document.body.insertBefore(this.wrapper, document.body.firstChild);
        }
    }

    showFred() {
        this.wrapper.removeAttribute('hidden');
    }

    hideFred() {
        this.wrapper.setAttribute('hidden', 'hidden');
    }

    init() {
        console.log('Hello from Fred!');

        emitter.on('fred-hide', () => {this.hideFred();});
        emitter.on('fred-show', () => {this.showFred();});
        
        this.render();
    }
}