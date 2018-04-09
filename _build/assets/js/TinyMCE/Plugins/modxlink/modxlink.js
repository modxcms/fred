export default fred => {
    return (editor, url) => {
        // Add a button that opens a window

        editor.addButton('modxlink', {
            icon: 'link',
            onclick: function () {

                console.log('show');
                let elm;
                let linkurl = '';
                let link_title = '';
                let link_text = editor.selection.getContent();
                let classes = '';
                let new_window = false;
                let activeTab = 0;

                elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
                if (elm) {
                    editor.selection.select(elm);
                    linkurl = editor.dom.getAttrib(elm, 'href');
                    link_title = editor.dom.getAttrib(elm, 'title');
                    classes = editor.dom.getAttrib(elm, 'class');
                    new_window = editor.dom.getAttrib(elm, 'target') === '_blank';
                    link_text = elm.innerText;
                }
                
                if (linkurl !== '') {
                    activeTab = 1;
                }

                const data = {
                    link_text,
                    link_title,
                    classes,
                    new_window,
                    page: {},
                    url: {
                        url: linkurl
                    },
                    email: {},
                    phone: {},
                    file: {}
                };

                const createLinkList = function () {
                    tinymce.util.XHR.send({
                        url: '/fred/assets/components/fred/web/endpoints/ajax.php?action=test&query=test',
                        success: function(text) {
                            console.log(tinymce.util.JSON.parse(text));
                        }
                    });
                };

                createLinkList();

                const tabPanel = new tinymce.ui.TabPanel({
                    type: 'tabpanel',
                    classes: 'fred--modxlink-panel',
                    activeTab,
                    items: [
                        {
                            title: 'Page',
                            id: 'page',
                            type: 'form',
                            items: [{
                                type: 'form',
                                layout: 'grid',
                                padding: 0,
                                columns: 2,
                                items: [
                                    {
                                        type: 'textbox',
                                        label: 'Page',
                                    },
                                    {
                                        type: 'textbox',
                                        label: 'Block on \'' + fred.config.pageSettings.pagetitle + '\'',
                                        onkeyup() {
                                            data.page.anchor = this.value();
                                        }
                                    }
                                ]
                            }]
                        },
                        {
                            title: 'URL',
                            id: 'url',
                            type: 'form',
                            items: [
                                {
                                    type: 'textbox',
                                    label: 'URL',
                                    value: data.url.url,
                                    onkeyup() {
                                        data.url.url = this.value();
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Email',
                            id: 'email',
                            type: 'form',
                            items: []
                        },
                        {
                            title: 'Phone',
                            id: 'phone',
                            type: 'form',
                            items: []
                        },
                        {
                            title: 'File',
                            id: 'file',
                            type: 'form',
                            items: []
                        }
                    ]
                });
                
                
                // Open window
                const win = editor.windowManager.open({
                    title: 'Link to',
                    classes: 'fred--modxlink',
                    data,
                    body: [
                        {
                            type: 'textbox',
                            label: 'Link Text',
                            name: 'link_text',
                            onkeyup() {
                                data.link_text = this.value();
                            }
                        },
                        {
                            type: 'form',
                            layout: 'grid',
                            padding: 0,
                            columns: 3,
                            items: [
                                {
                                    type: 'textbox',
                                    name: 'link_title',
                                    label: 'Link Title',
                                    onkeyup() {
                                        data.link_title = this.value();
                                    }

                                },
                                {
                                    type: 'textbox',
                                    name: 'classes',
                                    label: 'Classes',
                                    onkeyup() {
                                        data.classes = this.value();
                                    }
                                },
                                {
                                    type: 'checkbox',
                                    name: 'new_window',
                                    label: 'New Window',
                                    onchange() {
                                        data.new_window = this.value();
                                    }
                                }
                            ]
                        },
                        tabPanel
                        
                    ],
                    onsubmit: (tabPanel => {
                        return e => {
                            console.log(tabPanel.items()[tabPanel.activeTabId.slice(1)]._id);
                            console.log(data);

                                const elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
                                if (elm) {
                                    editor.focus();
                                    editor.dom.removeAllAttribs(elm);
                                    
                                    editor.dom.setAttrib(elm, 'href', data.url.url);
                                    
                                    if (data.link_title) {
                                        editor.dom.setAttrib(elm, 'title', data.link_title);
                                    }
                                    
                                    if (data.new_window) {
                                        editor.dom.setAttrib(elm, 'target', '_blank');
                                    }

                                    if (data.classes) {
                                        editor.dom.setAttrib(elm, 'class', data.classes);
                                    }
                                    
                                    elm.innerText = editor.dom.encode(data.link_text);
                                    editor.selection.select(elm);
                                    editor.selection.collapse(false);
                                } else {
                                    const attrs = {
                                        href: data.url.url
                                    };

                                    if (data.link_title) {
                                        attrs.title = data.link_title;
                                    }

                                    if (data.new_window) {
                                        attrs.target = '_blank';
                                    }
                                    
                                    if (data.classes) {
                                        attrs.class = data.classes;
                                    }
                                    
                                    editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(data.link_text)));

                                    editor.selection.collapse(false);
                                }
                            
                            // if (data.web_url !== '') {
                            //     const elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
                            //     if (elm) {
                            //         editor.focus();
                            //         editor.dom.setAttrib(elm, 'href', data.web_url);
                            //         editor.dom.setAttrib(elm, 'data-fred-link-page', 7);
                            //         editor.selection.collapse(false);
                            //     } else {
                            //         editor.insertContent(editor.dom.createHTML('a', {
                            //             href: data.web_url,
                            //             "data-fred-link-page": 6
                            //         }, editor.dom.encode(data.web_title)));
                            //
                            //
                            //         editor.selection.collapse(false);
                            //     }
                            // } else {
                            //     editor.insertContent('<strong>' + (editor.selection.getContent() || 'Title') + '</strong>: ' + data.page_title);
                            // }
                        }
                    })(tabPanel)
                });

                // const input = document.querySelector('#page_url');
                // const wrapper = document.createElement('div');
                // wrapper.classList.add('autocomplete');

                // input.parentNode.replaceChild(wrapper, input);
                // wrapper.appendChild(input);
            },
            stateSelector: 'a[href]'
        });

        return {
            getMetadata: function () {
                return {
                    name: "Example plugin",
                    url: "http://exampleplugindocsurl.com"
                };
            }
        };
    }
}