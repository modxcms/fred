export default class ElementHelper {
    static getData(el, initData) {
        const data = {
            global: {
                link_text: '',
                link_title: '',
                classes: '',
                new_window: false
            },
            page: {
                ...(initData.page)
            },
            url: {
                ...(initData.url)
            },
            email: {
                ...(initData.email)
            }
        };

        data.global.link_title = el.getAttribute('title');
        data.global.classes = el.getAttribute('class');
        data.global.new_window = (el.getAttribute('target') === '_blank');
        data.global.link_text = el.innerText;
        
        let url = el.getAttribute('href') || '';

        data.page.page = el.getAttribute('data-fred-link-page');
        data.page.anchor = el.getAttribute('data-fred-link-anchor');
        
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

        if (url.slice(0,7) === 'mailto:') {
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