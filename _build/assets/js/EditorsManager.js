import fredEditors from './Editors';

class EditorsManager {
    constructor() {
        this._editors = fredEditors;
    }
    
    registerEditor(name, editor) {
        if (!this._editors[name]) {
            this._editors[name] = editor;
            return true;
        } else {
            console.log(`Editor "${name}" is already registered`);
            return false;
        }
    }
    
    get editors() {
        return this._editors;
    }
}

const editorsManager = new EditorsManager();
export default editorsManager;