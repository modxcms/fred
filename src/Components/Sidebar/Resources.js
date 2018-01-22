import Sidebar from '../Sidebar';

export default class Resources extends Sidebar {
    static title = 'Resources';
    static icon = 'file-o';
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