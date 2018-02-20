import Sidebar from '../Sidebar';

export default class Pages extends Sidebar {
    static title = 'Pages';
    static expandable = true;

    click() {
        const content = '<div>THIS IS A DELAYED TEST CONTENT</div>';
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(content);
            }, 10000);
        })
    }
}