export default class Link {
    constructor(editor) {
        this.editor = editor;
        this.element = editor.dom.getParent(editor.selection.getStart(), 'a[href]')
    }
    
    insertLink(linkText, attributes) {
        this.editor.insertContent(this.editor.dom.createHTML('a', attributes, linkText));
    }
    
    editLink(linkText, attributes) {
        if (!this.element) return this.insertLink(linkText, attributes);

        this.editor.focus();
        this.editor.dom.removeAllAttribs(this.element);

        for (let attribute in attributes) {
            if (attributes.hasOwnProperty(attribute)) {
                this.editor.dom.setAttrib(this.element, attribute, attributes[attribute]);
            }
        }

        this.element.innerText = linkText;
        this.editor.selection.select(this.element);
    }
    
    handleLink(linkText, attributes) {
        if (!this.element) return this.insertLink(linkText, attributes);

        return this.editLink(linkText, attributes);
    }
    
    static getGeneralAttributes(data, type) {
        const attributes = {
            'data-fred-link-type': type
        };
        
        if (data.link_title) {
            attributes.title = data.link_title;
        }

        if (data.new_window) {
            attributes.target = '_blank';
        }

        if (data.classes) {
            attributes.class = data.classes;
        }
        
        return attributes;
    }
    
    savePage(data) {
        if (!data.page.page && !data.page.anchor) return;

        const attributes = {
            ...(Link.getGeneralAttributes(data, 'page')),
            'data-fred-link-page': data.page.page
        };

        if (data.page.anchor) {
            attributes['data-fred-link-anchor'] = data.page.anchor;
            attributes.href = `${data.page.url}#${data.page.anchor}`;
        } else {
            attributes.href = data.page.url;
        }
        
        return this.handleLink(this.editor.dom.encode(data.link_text), attributes);
    }
    
    saveUrl(data) {
        if (!data.url.url) return;

        return this.handleLink(this.editor.dom.encode(data.link_text), {
            ...(Link.getGeneralAttributes(data, 'url')),
            href: data.url.url
        });
    }
    
    saveEmail(data) {
        if (!data.email.to) return;

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
        
        return this.handleLink(this.editor.dom.encode(data.link_text), {
            ...(Link.getGeneralAttributes(data, 'email')),
            href
        });
    }
    
    savePhone(data) {
        if (!data.phone.phone) return;
        
        return this.handleLink(this.editor.dom.encode(data.link_text), {
            ...(Link.getGeneralAttributes(data, 'phone')),
            href: `tel:${data.phone.phone}`
        });
    }
    
    saveFile(data) {
        if (!data.file.file) return;
        
        return this.handleLink(this.editor.dom.encode(data.link_text), {
            ...(Link.getGeneralAttributes(data, 'file')),
            href: data.file.file
        });
    }
    
    save(type, data) {
        switch (type) {
            case 'page':
                this.savePage(data);
                break;
            case 'url':
                this.saveUrl(data);
                break;
            case 'email':
                this.saveEmail(data);
                break;
            case 'phone':
                this.savePhone(data);
                break;
            case 'file':
                this.saveFile(data);
                break;
        }

        this.editor.selection.collapse(false);
    }
}