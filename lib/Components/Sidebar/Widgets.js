'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sidebar2 = require('../Sidebar');

var _Sidebar3 = _interopRequireDefault(_Sidebar2);

var _dragula = require('dragula');

var _dragula2 = _interopRequireDefault(_dragula);

var _EE = require('../../EE');

var _EE2 = _interopRequireDefault(_EE);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Widgets = function (_Sidebar) {
    _inherits(Widgets, _Sidebar);

    function Widgets() {
        _classCallCheck(this, Widgets);

        return _possibleConstructorReturn(this, (Widgets.__proto__ || Object.getPrototypeOf(Widgets)).apply(this, arguments));
    }

    _createClass(Widgets, [{
        key: 'init',
        value: function init() {
            this.drake = null;
        }
    }, {
        key: 'click',
        value: function click() {
            var content = document.createElement('div');
            content.classList.add('fred--thumbs', 'source');

            content.innerHTML = '<figure class="fred--thumb">\n' + '                            <div><img src="layouts/full-width.svg" alt=""></div>\n' + '                            <figcaption>\n' + '                                <strong>Full Width</strong>\n' + '                            </figcaption>\n' + '                            <div class="chunk" hidden="hidden">\n' + '                                <h2 contenteditable="true">{header}</h2>\n' + '                                <p contenteditable="true">{description}</p>\n' + '                            </div>\n' + '                        </figure>\n' + '                        <figure class="fred--thumb">\n' + '                            <div><img src="layouts/right-panel-layout.svg" alt=""></div>\n' + '                            <figcaption>\n' + '                                <strong>2 Column</strong>\n' + '                                <em>Content Left. Component Right.</em>\n' + '                            </figcaption>\n' + '                            <div class="chunk" hidden="hidden">\n' + '                                <h3>Can\'t Edit THIS</h3>\n' + '                                <img src="http://via.placeholder.com/350x150" />\n' + '                                <p contenteditable="true">Description</p>\n' + '                            </div>\n' + '                        </figure>\n' + '                        <figure class="fred--thumb">\n' + '                            <div><img src="layouts/four-grid.svg" alt=""></div>\n' + '                            <figcaption>\n' + '                                <strong>Grid</strong>\n' + '                            </figcaption>\n' + '                            <div class="chunk" hidden="hidden">\n' + '                                <p contenteditable="true">Description Only</p>\n' + '                            </div>\n' + '                        </figure>';

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(content.outerHTML);
                }, 500);
            });
        }
    }, {
        key: 'afterExpand',
        value: function afterExpand() {
            if (this.drake === null) {
                var containers = [].concat(_toConsumableArray(document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')));
                containers.unshift(document.querySelector('.source'));

                this.drake = (0, _dragula2.default)(containers, {
                    copy: function copy(el, source) {
                        return source === document.getElementsByClassName('source')[0];
                    },
                    accepts: function accepts(el, target) {
                        return target !== document.getElementsByClassName('source')[0];
                    },
                    moves: function moves(el, source, handle, sibling) {
                        if (source.dataset.fredDropzone !== undefined && source.dataset.fredDropzone !== '') {
                            return handle.classList.contains('handle');
                        }

                        return true;
                    }
                });

                this.drake.on('drop', function (el, target, source, sibling) {
                    if (source.classList.contains('source')) {
                        var wrapper = document.createElement('div');
                        wrapper.classList.add('test-wrapper');

                        var toolbar = document.createElement('div');
                        var handle = document.createElement('i');
                        handle.classList.add('fa', 'fa-heart', 'handle');

                        toolbar.appendChild(handle);

                        wrapper.appendChild(toolbar);

                        var content = document.createElement('div');

                        content.innerHTML = el.getElementsByClassName('chunk')[0].innerHTML;

                        content.querySelectorAll('[contenteditable]').forEach(function (item) {
                            item.innerHTML = item.innerHTML.replace(/\[\[\+[a-z]+\]\]/, 'Placeholder');

                            item.addEventListener('input', function (e) {
                                console.log(e.srcElement.innerHTML);
                            });
                        });

                        /*
                        // Prevent creating new paragraph on enter key press
                        content.addEventListener('keypress', e => {
                            if ((e.charCode === 13) && (e.shiftKey === false)) {
                                e.preventDefault();
                                return false;
                            }
                        });*/

                        wrapper.appendChild(content);

                        el.parentNode.replaceChild(wrapper, el);
                    }
                });

                this.drake.on('drag', function (el, source) {
                    _EE2.default.emit('fred-sidebar-hide');
                });

                this.drake.on('dragend', function (el) {
                    _EE2.default.emit('fred-sidebar-show');
                });
            } else {
                var _containers = [].concat(_toConsumableArray(document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')));
                _containers.unshift(document.querySelector('.source'));

                this.drake.containers = _containers;
            }
        }
    }]);

    return Widgets;
}(_Sidebar3.default);

Widgets.title = 'Widgets';
Widgets.icon = 'television';
Widgets.expandable = true;
exports.default = Widgets;
module.exports = exports['default'];