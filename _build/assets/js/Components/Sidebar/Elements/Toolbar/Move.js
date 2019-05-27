import ToolbarPlugin from "./ToolbarPlugin";
import {button, div} from "../../../../UI/Elements";
import fredConfig from "../../../../Config";

export default class Move extends ToolbarPlugin {
    static permission = 'fred_element_move';

    customRender() {
        const positionGroup = div(['fred--position-group']);

        const moveUp = button('', 'fred.fe.content.move_up', ['fred--position-up'], this.moveUp.bind(this));
        const moveDown = button('', 'fred.fe.content.move_down', ['fred--position-down'], this.moveDown.bind(this));

        positionGroup.appendChild(moveUp);
        positionGroup.appendChild(moveDown);

        return positionGroup;
    }

    moveDown() {
        if (!fredConfig.permission.fred_element_move) return;

        const moveDownRoot = () => {
            this.el.wrapper.parentElement.insertBefore(this.el.wrapper.nextElementSibling, this.el.wrapper);
        };

        const moveDownToDropzone = (target, dzName) => {
            target.unshiftElementToDropZone(dzName, this.el);
        };

        const moveDownInDropzone = (fredEl, index) => {
            fredEl.parent.dzs[fredEl.dzName].children[index + 1].insertAdjacentElement('afterend', fredEl.wrapper);
            fredEl.parent.dzs[fredEl.dzName].children[index] = fredEl.parent.dzs[fredEl.dzName].children.splice((index + 1), 1, fredEl.parent.dzs[fredEl.dzName].children[index])[0];
        };

        const moveDownFromDropzone = () => {
            if (!this.el.parent.parent) {
                if (!this.el.parent.wrapper.nextElementSibling) {
                    this.el.dzName = this.el.parent.wrapper.parentElement.dataset.fredDropzone;
                    this.el.parent.wrapper.parentElement.appendChild(this.el.wrapper);
                    this.el.parent = null;
                } else {
                    this.el.dzName = this.el.parent.wrapper.parentElement.dataset.fredDropzone;
                    this.el.parent.wrapper.parentElement.insertBefore(this.el.wrapper, this.el.parent.wrapper.nextElementSibling);
                    this.el.parent = null;
                }
            } else {
                const parentPosition = this.el.parent.parent.dzs[this.el.parent.dzName].children.indexOf(this.el.parent.wrapper);
                if (parentPosition !== -1) {
                    if ((this.el.parent.parent.dzs[this.el.parent.dzName].children.length - 1) === parentPosition) {
                        this.el.parent.parent.addElementToDropZone(this.el.parent.dzName, this.el);
                    } else {
                        this.el.parent.parent.insertBeforeElementToDropZone(this.el.parent.dzName, this.el.parent.parent.dzs[this.el.parent.dzName].children[parentPosition + 1].fredEl, this.el);
                    }
                }
            }
        };

        if (!this.el.parent) {
            if (this.el.wrapper.nextElementSibling) {
                const dzList = Object.keys(this.el.wrapper.nextElementSibling.fredEl.dzs);
                if (dzList.length > 0) {
                    moveDownToDropzone(this.el.wrapper.nextElementSibling.fredEl, dzList[0]);
                } else {
                    moveDownRoot();
                }
            }
        } else {
            let carry = false;

            for (let dzName in this.el.parent.dzs) {
                if (this.el.parent.dzs.hasOwnProperty(dzName)) {
                    if (carry === true) {
                        carry = false;
                        moveDownToDropzone(this.el.parent, dzName);
                        break;
                    }

                    if (dzName !== this.el.dzName) continue;

                    const index = this.el.parent.dzs[dzName].children.indexOf(this.el.wrapper);
                    if (index !== -1) {
                        const nextChild = this.el.parent.dzs[dzName].children[index + 1];
                        if (nextChild) {
                            const dzList = Object.keys(nextChild.fredEl.dzs);
                            if (dzList.length > 0) {
                                this.el.parent.dzs[dzName].children.splice(index, 1);
                                moveDownToDropzone(nextChild.fredEl, dzList[0]);
                            } else {
                                moveDownInDropzone(this.el, index);
                            }
                        } else {
                            this.el.parent.dzs[dzName].children.pop();
                            carry = true;
                        }
                    }
                }
            }

            if (carry === true) {
                moveDownFromDropzone();
            }
        }
    }

    moveUp() {
        if (!fredConfig.permission.fred_element_move) return;

        const moveUpRoot = () => {
            this.el.wrapper.parentElement.insertBefore(this.el.wrapper, this.el.wrapper.previousElementSibling);
        };

        const moveUpToDropzone = (target, dzName) => {
            target.addElementToDropZone(dzName, this.el);
        };

        const moveUpFromDropzone = () => {
            if (!this.el.parent.parent) {
                this.el.dzName = this.el.parent.wrapper.parentElement.dataset.fredDropzone;
                this.el.parent.wrapper.parentElement.insertBefore(this.el.wrapper, this.el.parent.wrapper);
                this.el.parent = null;
            } else {
                const parentPosition = this.el.parent.parent.dzs[this.el.parent.dzName].children.indexOf(this.el.parent.wrapper);
                if (parentPosition !== -1) {
                    if (0 === parentPosition) {
                        this.el.parent.parent.unshiftElementToDropZone(this.el.parent.dzName, this.el);
                    } else {
                        this.el.parent.parent.insertBeforeElementToDropZone(this.el.parent.dzName, this.el.parent, this.el);
                    }
                }
            }
        };

        const moveUpInDropzone = (fredEl, index) => {
            fredEl.parent.dzs[fredEl.dzName].children[index - 1].insertAdjacentElement('beforebegin', fredEl.wrapper);
            fredEl.parent.dzs[fredEl.dzName].children[index - 1] = fredEl.parent.dzs[fredEl.dzName].children.splice(index, 1, fredEl.parent.dzs[fredEl.dzName].children[index - 1])[0];
        };

        if (!this.el.parent) {
            if (this.el.wrapper.previousElementSibling) {
                const dzList = Object.keys(this.el.wrapper.previousElementSibling.fredEl.dzs);
                if (dzList.length > 0) {
                    moveUpToDropzone(this.el.wrapper.previousElementSibling.fredEl, dzList[dzList.length - 1]);
                } else {
                    moveUpRoot();
                }
            }
        } else {
            let carry = false;
            const dropZones = Object.keys(this.el.parent.dzs);
            for (let i = dropZones.length; i--; ) {
                const dzName = dropZones[i];

                if (carry === true) {
                    carry = false;
                    moveUpToDropzone(this.el.parent, dzName);
                    break;
                }

                if (dzName !== this.el.dzName) continue;

                const index = this.el.parent.dzs[dzName].children.indexOf(this.el.wrapper);
                if (index !== -1) {
                    const prevChild = this.el.parent.dzs[dzName].children[index - 1];
                    if (prevChild) {
                        const dzList = Object.keys(prevChild.fredEl.dzs);
                        if (dzList.length > 0) {
                            this.el.parent.dzs[dzName].children.splice(index, 1);
                            moveUpToDropzone(prevChild.fredEl, dzList[dzList.length - 1]);
                        } else {
                            moveUpInDropzone(this.el, index);
                        }
                    } else {
                        this.el.parent.dzs[dzName].children.shift();
                        carry = true;
                    }
                }
            }

            if (carry === true) {
                moveUpFromDropzone();
            }
        }

    }
}
