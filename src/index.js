import emitter from './EE';

export default class Fred {
    constructor(config = {}) {
        this.init();
    }
    
    init() {
        console.log('Hello from Fred!');
    }
}