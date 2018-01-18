import Sidebar from '../Sidebar';

export default class Widgets extends Sidebar {
    static title = 'Widgets';
    static icon = 'television';
    static expandable = true;

    click() {
        const content = '<figure class="fred--thumb">\n' +
            '                            <div><img src="layouts/full-width.svg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>Full Width</strong>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" hidden="hidden">\n' +
            '                                <h2>Header #2</h2>\n' +
            '                                <p>Description</p>\n' +
            '                            </div>\n' +
            '                        </figure>\n' +
            '                        <figure class="fred--thumb">\n' +
            '                            <div><img src="layouts/right-panel-layout.svg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>2 Column</strong>\n' +
            '                                <em>Content Left. Component Right.</em>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" hidden="hidden">\n' +
            '                                <h3>Header #3</h3>\n' +
            '                                <img src="http://via.placeholder.com/350x150" />\n' +
            '                                <p>Description</p>\n' +
            '                            </div>\n' +
            '                        </figure>\n' +
            '                        <figure class="fred--thumb">\n' +
            '                            <div><img src="layouts/four-grid.svg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>Grid</strong>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" hidden="hidden">\n' +
            '                                <p>Description Only</p>\n' +
            '                            </div>\n' +
            '                        </figure>';
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(content);
            }, 500);
        })
    }
}