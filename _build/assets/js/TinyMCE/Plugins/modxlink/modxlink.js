import Choices from 'choices.js';
import fetch from 'isomorphic-fetch';
import Data from './Data';
import Link from './Link';

export default fred => {
    return (editor, url) => {
        // Add a button that opens a window

        editor.addButton('modxlink', {
            icon: 'link',
            onclick: function () {
                const dataHelper = new Data(editor);
                let activeTab = 0;

                const data = dataHelper.getData();

                switch (dataHelper.getActiveTab()) {
                    case 'page':
                        activeTab = 0;
                        break;
                    case 'url':
                        activeTab = 1;
                        break;
                    case 'email':
                        activeTab = 2;
                        break;
                    case 'phone':
                        activeTab = 3;
                        break;
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
                            items: [
                                {
                                    id: 'pagecontainer',
                                    type: 'container',
                                    html: '<label for="page_url">Page Title</label><select id="page_url"></select>'
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
                            items: [{
                                type: 'textbox',
                                label: 'Phone',
                                value: data.phone.phone,
                                onkeyup() {
                                    data.phone.phone = this.value();
                                }
                            }]
                        },
                        {
                            title: 'File',
                            id: 'file',
                            type: 'form',
                            items: []
                        }
                    ]
                });

                const linkText = new tinymce.ui.TextBox({
                    type: 'textbox',
                    label: 'Link Text',
                    name: 'link_text',
                    onkeyup() {
                        data.link_text = this.value();
                    }
                });

                // Open window
                const win = editor.windowManager.open({
                    title: 'Link to',
                    classes: 'fred--modxlink',
                    data,
                    body: [
                        linkText,
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
                            const link = new Link(editor);
                            const activeTab = tabPanel.items()[tabPanel.activeTabId.slice(1)]._id;

                            link.save(activeTab, data)
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

                const templateInputChoices = new Choices(input, {
                    removeItemButton: true
                });
                templateInputChoices.ajax(callback => {
                    fetch(`${fred.config.assetsUrl}endpoints/ajax.php?action=rte-get-resources&current=${data.page.page}`)
                        .then(response => {
                            return response.json()
                        })
                        .then(json => {
                            initData = json.data.resources;
                            callback(json.data.resources, 'value', 'pagetitle');
                            
                            if (json.data.current) {
                                templateInputChoices.setChoices([json.data.current], 'value', 'pagetitle', false);
                                templateInputChoices.setValueByChoice(data.page.page);
                                
                                const pageAnchorEl = document.getElementById('page_anchor-l');
                                if (pageAnchorEl) {
                                    pageAnchorEl.innerText = `Block on '${json.data.current.pagetitle}'`;
                                }       
                            }
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
                    
                    if (!data.link_text) {
                        data.link_text = event.detail.choice.label;
                        linkText.value(event.detail.choice.label);
                    }

                    const pageAnchorEl = document.getElementById('page_anchor-l');
                    if (pageAnchorEl) {
                        pageAnchorEl.innerText = `Block on '${event.detail.choice.label}'`;
                    }
                });
                
                templateInputChoices.passedElement.addEventListener('removeItem', event => {
                    if (templateInputChoices.getValue()) return;
                    
                    data.page.page = '';
                    data.page.url = '';
                    const pageAnchorEl = document.getElementById('page_anchor-l');
                    if (pageAnchorEl) {
                        pageAnchorEl.innerText = `Block on '${fred.config.pageSettings.pagetitle }'`;
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