export default class Data {
    constructor(editor) {
        this.editor = editor;
        this.element = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
        
        this.initialData = {
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
            phone: {
                phone: ''
            },
            file: {
                file: ''
            }
        };
        
        this.activeTab = 'page';
        this.data = this.parseData();
    }
    
    getData() {
        return this.data;
    }
    
    getActiveTab() {
        return this.activeTab;
    }

    parseData() {
        const elementData = this.getElementData();
        this.activeTab = elementData.tab;
        
        return {
            ...(this.initialData),
            ...(elementData.data)
        };
    }
    
    getElementData() {
        if (!this.element) return {};
        
        this.editor.selection.select(this.element);
        
        const data = {
            global: {
                link_text: '',
                link_title: '',
                classes: '',
                new_window: false
            },
            page: {
                ...(this.initialData.page || {})
            },
            url: {
                ...(this.initialData.url || {})
            },
            email: {
                ...(this.initialData.email || {})
            },
            phone: {
                ...(this.initialData.phone || {})
            },
            file: {
                ...(this.initialData.file || {})
            }
        };

        data.global.link_title = this.element.getAttribute('title');
        data.global.classes = this.element.getAttribute('class');
        data.global.new_window = (this.element.getAttribute('target') === '_blank');
        data.global.link_text = this.element.innerText;

        const linkType = this.element.dataset.fredLinkType;
        let url = this.element.getAttribute('href') || '';

        if (linkType === 'page') {
            data.page.page = this.element.getAttribute('data-fred-link-page');
            data.page.anchor = this.element.getAttribute('data-fred-link-anchor');
            
            if (data.page.page || data.page.anchor) {
                data.page.url = url.replace(('#' + data.page.anchor), '');
    
                return {
                    tab: 'page',
                    data: {
                        ...(data.global),
                        page: {
                            ...(data.page)
                        }
                    }
                };
            }
        }

        if (linkType === 'email') {
            if (url.slice(0, 7) === 'mailto:') {
                url = url.slice(7);
                url = url.split('?');

                data.email.to = url[0];
                if (url[1]) {
                    const components = url[1].split('&');
                    components.forEach(component => {
                        component = component.split('=');
                        if (component[0] === 'subject') {
                            data.email.subject = decodeURI(component[1]);
                        }

                        if (component[0] === 'body') {
                            data.email.body = decodeURI(component[1]);
                        }
                    });
                }

                return {
                    tab: 'email',
                    data: {
                        ...(data.global),
                        email: {
                            ...(data.email)
                        }
                    }
                }
            }
        }

        if (linkType === 'phone') {
            if (url.slice(0, 4) === 'tel:') {
                data.phone.phone = url.slice(4);

                return {
                    tab: 'phone',
                    data: {
                        ...(data.global),
                        phone: {
                            ...(data.phone)
                        }
                    }
                }
            }
        }

        if (linkType === 'file') {
            data.file.file = url;
            
            return {
                tab: 'file',
                data: {
                    ...(data.global),
                    file: {
                        ...(data.file)
                    }
                }
            }
        }

        data.url.url = url;

        return {
            tab: 'url',
            data: {
                ...(data.global),
                url: {
                    ...(data.url)
                }
            }
        };
    }
}