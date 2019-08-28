import Element from "./Element";

export class Dropzone {
    constructor(el, parent = null) {
        this.el = el;
        this.name = el.dataset.fredDropzone;
        this.parent = parent;
        this.elements = [];

        this.setProperties();
    }

    setProperties() {
        const minHeight = this.el.dataset.fredMinHeight;
        if (minHeight) {
            this.el.style.minHeight = minHeight;
        }

        const minWidth = this.el.dataset.fredMinWidth;
        if (minWidth) {
            this.el.style.minWidth = minWidth;
        }
    }

    render() {
        this.setProperties();
        this.elements.forEach(element => {
            this.el.appendChild(element.wrapper);
        });
    }

    loadElements(data, markup, before = null, clear = true, fireEvents = false) {
        const promises = [];

        if (clear) {
            this.el.innerHTML = '';
        }

        data.forEach(element => {
            if (markup[element.widget].html) {
                const contentElement = Element.fromMarkup(element, markup[element.widget], this);

                promises.push(
                    contentElement.render(false, false)
                        .then(wrapper => {
                            const dzPromises = [];

                            for (let zoneName in element.children) {
                                if (element.children.hasOwnProperty(zoneName)) {
                                    if (!wrapper.fredEl.dzs[zoneName]) continue;

                                    dzPromises.push(wrapper.fredEl.dzs[zoneName].loadElements(element.children[zoneName], markup));
                                }
                            }

                            return Promise.all(dzPromises).then(() => {
                                if (fireEvents) {
                                    const event = new CustomEvent('FredElementDrop', {detail: {fredEl: wrapper.fredEl}});
                                    document.body.dispatchEvent(event);

                                    const jsElements = wrapper.querySelectorAll('[data-fred-on-drop]');
                                    for (let jsEl of jsElements) {
                                        if (window[jsEl.dataset.fredOnDrop]) {
                                            window[jsEl.dataset.fredOnDrop](jsEl);
                                        }
                                    }
                                }

                                return wrapper;
                            });
                        })
                );
            }
        });

        return Promise.all(promises).then(wrappers => {
            wrappers.forEach(wrapper => {
                if (!before) {
                    this.pushElement(wrapper.fredEl);
                } else {
                    this.insertBefore(wrapper.fredEl, before.fredEl);
                }
            });

            return wrappers;
        });
    }

    removeElement(element) {
        this.elements = this.elements.filter(el => {
            return el.wrapper !== element.wrapper;
        });

        element.wrapper.remove();
    }

    getContent(noId = false) {
        const data = [];

        this.elements.forEach(el => data.push(el.getContent(noId)));

        return data;
    }

    getCleanContent(parseModx = false, handleLinks = true, isPreview = false) {
        const promises = [];

        this.elements.forEach(el => promises.push(el.cleanRender(parseModx, handleLinks, isPreview)));

        return Promise.all(promises).then(values => {
            let cleanedContent = '';

            values.forEach(el => {
                cleanedContent += el.innerHTML;
            });

            return cleanedContent;
        });
    }

    insertAfter(element, after, manipulateDom = true) {
        const index = this.elements.findIndex(el => el.wrapper === after.wrapper);
        if (~index) {
            this.elements.splice(index + 1, 0, element);

            if (manipulateDom) {
                if (after.wrapper.nextSibling === null) {
                    after.wrapper.parentNode.appendChild(element.wrapper);
                } else {
                    after.wrapper.parentNode.insertBefore(element.wrapper, after.wrapper.nextSibling);
                }
            }

            element.dropzone = this;
        }
    }

    insertBefore(element, before, manipulateDom = true) {
        const index = this.elements.findIndex(el => el.wrapper === before.wrapper);
        if (~index) {
            this.elements.splice(index, 0, element);

            if (manipulateDom) {
                before.wrapper.parentNode.insertBefore(element.wrapper, before.wrapper);
            }

            element.dropzone = this;
        }
    }

    unshiftElement(element, manipulateDom = true) {
        if (manipulateDom) {
            if (this.elements.length > 0) {
                this.el.insertBefore(element.wrapper, this.elements[0].wrapper);
            } else {
                this.el.appendChild(element.wrapper);
            }
        }

        element.dropzone = this;
        this.elements.unshift(element);
    }

    pushElement(element, manipulateDom = true) {
        if (manipulateDom) {
            this.el.appendChild(element.wrapper);
        }

        element.dropzone = this;
        this.elements.push(element);
    }

    duplicate(targetDropzone) {
        const promises = [];

        this.elements.forEach(el => {
            const clone = new Element(el.el, targetDropzone, el.content, el.settings, el.pluginsData);
            targetDropzone.elements.push(clone);

            promises.push(clone.render(false, false).then(() => {
                targetDropzone.el.appendChild(clone.wrapper);

                for (let dzName in el.dzs) {
                    if (el.dzs.hasOwnProperty(dzName)) {
                        el.dzs[dzName].duplicate(clone.dzs[dzName]);
                    }
                }
            }));
        });

        return Promise.all(promises);
    }

    moveElement(element, target, before = null, manipulateDom = true) {
        const index = element.dropzone.elements.findIndex(el => el.wrapper === element.wrapper);
        element.dropzone.elements.splice(index, 1);

        if (before === null) {
            target.pushElement(element, manipulateDom);
        } else {
            target.insertBefore(element, before, manipulateDom);
        }
    }

    moveElementDown(element) {
        const index = this.elements.findIndex(el => el.wrapper === element.wrapper);
        if (index === (this.elements.length - 1)) {
            if (!this.parent) return;

            const parentDropzones = Object.keys(this.parent.dzs);
            const nextDropzoneIndex = parentDropzones.indexOf(this.name) + 1;
            if (nextDropzoneIndex < parentDropzones.length) {
                // Insert as the first element to the next dropzone
                this.parent.dzs[parentDropzones[nextDropzoneIndex]].unshiftElement(element);
                this.elements.splice(index, 1);

                return;
            }

            // Insert after dropzone's parent
            this.parent.dropzone.insertAfter(element, this.parent);
            this.elements.splice(index, 1);

            return;
        }

        const nextElementDropzones = Object.keys(this.elements[index + 1].dzs);
        if (nextElementDropzones.length > 0) {
            // Insert as the first element to the first dropzone of the next element
            this.elements[index + 1].dzs[nextElementDropzones[0]].unshiftElement(element);
            this.elements.splice(index, 1);

            return;
        }

        // Move down in the same dropzone
        this.elements[index] = this.elements.splice((index + 1), 1, this.elements[index])[0];
        element.wrapper.parentElement.insertBefore(element.wrapper.nextElementSibling, element.wrapper);
    }

    moveElementUp(element) {
        const index = this.elements.findIndex(el => el.wrapper === element.wrapper);
        if (index === 0) {
            if (!this.parent) return;

            const parentDropzones = Object.keys(this.parent.dzs);
            const prevDropzoneIndex = parentDropzones.indexOf(this.name) - 1;
            if (prevDropzoneIndex >= 0) {
                // Insert as the last element to the previous dropzone
                this.parent.dzs[parentDropzones[prevDropzoneIndex]].pushElement(element);
                this.elements.splice(index, 1);

                return;
            }

            // Insert before dropzone's parent
            this.parent.dropzone.insertBefore(element, this.parent);
            this.elements.splice(index, 1);

            return;
        }

        const prevElementDropzones = Object.keys(this.elements[index - 1].dzs);
        if (prevElementDropzones.length > 0) {
            // Insert as the last element to the last dropzone of the previous element
            this.elements[index - 1].dzs[prevElementDropzones[prevElementDropzones.length - 1]].pushElement(element);
            this.elements.splice(index, 1);

            return
        }

        // Move up in the same dropzone
        this.elements[index - 1] = this.elements.splice(index, 1, this.elements[index - 1])[0];
        element.wrapper.parentElement.insertBefore(element.wrapper, element.wrapper.previousElementSibling);
    }
}

export default Dropzone;
