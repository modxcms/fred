import Choices from 'choices.js';
import fetch from 'isomorphic-fetch';
import ElementHelper from './ElementHelper';

export default fred => {
    return (editor, url) => {
        // Add a button that opens a window

        editor.addButton('modxlink', {
            icon: 'link',
            onclick: function () {

                let elm;
                let activeTab = 0;

                let data = {
                    link_text: editor.selection.getContent(),
                    link_title: '',
                    classes: '',
                    new_window: false,
                    page: {
                        page: '',
                        url: '',
                        anchor: ''
                    },
                    url: {
                        url: ''
                    },
                    email: {
                        to: '',
                        subject: '',
                        body: ''
                    },
                    phone: {},
                    file: {}
                };
                
                elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
                if (elm) {
                    editor.selection.select(elm);

                    const parsedData = ElementHelper.getData(elm, data);
                    
                    data = {
                        ...data,
                        ...(parsedData.data)
                    };
     
                    switch (parsedData.tab) {
                        case 'page':
                            activeTab = 0;
                            break;
                        case 'url':
                            activeTab = 1;
                            break;
                        case 'email':
                            activeTab = 2;
                            break;
                    }
                }
                
                console.log(data);

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
                                        type: 'selectbox',
                                        label: 'Page',
                                        id: 'page_url',
                                        value: data.page.page
                                    },
                                    {
                                        type: 'textbox',
                                        label: `Block on '${fred.config.pageSettings.pagetitle }'`,
                                        id: 'page_anchor',
                                        value: data.page.anchor,
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
                            items: [
                                {
                                    type: 'textbox',
                                    label: 'To',
                                    value: data.email.to,
                                    onkeyup() {
                                        data.email.to = this.value();
                                    }
                                },
                                {
                                    type: 'textbox',
                                    label: 'Subject',
                                    value: data.email.subject,
                                    onkeyup() {
                                        data.email.subject = this.value();
                                    }
                                },
                                {
                                    type: 'textbox',
                                    multiline: true,
                                    label: 'Body',
                                    value: data.email.body,
                                    onkeyup() {
                                        data.email.body = this.value();
                                    }
                                }
                            ]
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
                            const activeTab = tabPanel.items()[tabPanel.activeTabId.slice(1)]._id;
                            console.log(activeTab);
                            console.log(data);

                            const elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
                            
                            if (activeTab === 'page') {
                                if (elm) {
                                    if (!data.page.page && ! data.page.anchor) return;
                                    
                                    editor.focus();
                                    editor.dom.removeAllAttribs(elm);

                                    
                                    editor.dom.setAttrib(elm, 'data-fred-link-page', data.page.page);

                                    if (data.page.anchor) {
                                        editor.dom.setAttrib(elm, 'data-fred-link-anchor', data.page.anchor);
                                        editor.dom.setAttrib(elm, 'href', data.page.url + '#' + data.page.anchor);
                                    } else {
                                        editor.dom.setAttrib(elm, 'href', data.page.url);
                                    }
                                    
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
                                        href: data.page.url,
                                        'data-fred-link-page': data.page.page
                                    };

                                    if (data.page.anchor) {
                                        attrs['data-fred-link-anchor'] = data.page.anchor;
                                        attrs.href = data.page.url + '#' + data.page.anchor;
                                    }

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
                                
                                return;
                            }
                            
                            if (activeTab === 'url') {
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
                            }

                            if (activeTab === 'email') {
                                if (elm) {
                                    editor.focus();
                                    editor.dom.removeAllAttribs(elm);

                                    let href = `mailto:${data.email.to}`;
                                    const mailAttrs = [];
                                    
                                    if (data.email.subject) {
                                        mailAttrs.push('subject=' + encodeURI(data.email.subject)); 
                                    }

                                    if (data.email.body) {
                                        mailAttrs.push('body=' + encodeURI(data.email.body));
                                    }
                                    
                                    if (mailAttrs.length > 0) {
                                        href += '?' + mailAttrs.join('&');
                                    }
                                    
                                    
                                    editor.dom.setAttrib(elm, 'href', href);

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
                                    let href = `mailto:${data.email.to}`;
                                    const mailAttrs = [];

                                    if (data.email.subject) {
                                        mailAttrs.push('subject=' + encodeURI(data.email.subject));
                                    }

                                    if (data.email.body) {
                                        mailAttrs.push('body=' + encodeURI(data.email.body));
                                    }

                                    if (mailAttrs.length > 0) {
                                        href += '?' + mailAttrs.join('&');
                                    }
                                    
                                    const attrs = {
                                        href
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
                            }
                        }
                    })(tabPanel)
                });

                const input = document.querySelector('#page_url');
                // const wrapper = document.createElement('div');
                // wrapper.classList.add('choices__inner');
                //
                // input.parentNode.replaceChild(wrapper, input);
                // wrapper.appendChild(input);

                let lookupTimeout = null;
                const lookupCache = {};
                let initData = [];
                
                const templateInputChoices = new Choices(input);
                templateInputChoices.ajax(callback => {
                    fetch(`${fred.config.assetsUrl}endpoints/ajax.php?action=rte-get-resources`)
                        .then(response => {
                            return response.json()
                        })
                        .then(data => {
                            initData = data.data.resources;
                            callback(data.data.resources, 'value', 'pagetitle');
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });

                const populateOptions = options => {
                    const toRemove = [];

                    templateInputChoices.currentState.items.forEach(item => {
                        if (item.active) {
                            toRemove.push(item.value);
                        }
                    });

                    const toKeep = [];
                    options.forEach(option => {
                        if (toRemove.indexOf(option.id) === -1) {
                            toKeep.push(option);
                        }
                    });

                    templateInputChoices.setChoices(toKeep, 'value', 'pagetitle', true);
                };

                const serverLookup = () => {
                    const query = templateInputChoices.input.value;
                    if (query in lookupCache) {
                        populateOptions(lookupCache[query]);
                    } else {
                        fetch(`${fred.config.assetsUrl}endpoints/ajax.php?action=rte-get-resources&query=${query}`)
                            .then(response => {
                                return response.json()
                            })
                            .then(data => {
                                lookupCache[query] = data.data.resources;
                                populateOptions(data.data.resources);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                };

                templateInputChoices.passedElement.addEventListener('search', event => {
                    clearTimeout(lookupTimeout);
                    lookupTimeout = setTimeout(serverLookup, 200);
                });

                templateInputChoices.passedElement.addEventListener('choice', event => {
                    templateInputChoices.setChoices(initData, 'value', 'pagetitle', true);
                    data.page.page = event.detail.choice.value;
                    data.page.url = event.detail.choice.customProperties.url;
                    
                    const pageAnchorEl = document.getElementById('page_anchor-l');
                    if (pageAnchorEl) {
                        pageAnchorEl.innerText = 'Block on \'' + event.detail.choice.label + '\'';
                    }
                });
           
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