import {div} from "../UI/Elements";
import emitter from "../EE";

class UtilitySidebar {
    constructor() {
        this.rendered = false;
        this.wrapper = null;
    }
    
    render() {
        if (this.rendered === true) return this.wrapper;
        
        this.rendered = true;
        this.wrapper = div(['fred--panel', 'fred--panel_element', 'fred--hidden']);

        emitter.emit('fred-wrapper-insert', this.wrapper);
        
        return this.wrapper;
    }
    
    open(el) {
        if (this.rendered === false) this.render();

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(el);

        this.wrapper.classList.remove('fred--hidden');
    }

    close() {
        this.wrapper.classList.add('fred--hidden');
    }
}

const utilitySidebar = new UtilitySidebar();
export default utilitySidebar;