'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EE = require('./EE');

var _EE2 = _interopRequireDefault(_EE);

var _Resources = require('./Components/Sidebar/Resources');

var _Resources2 = _interopRequireDefault(_Resources);

var _Widgets = require('./Components/Sidebar/Widgets');

var _Widgets2 = _interopRequireDefault(_Widgets);

var _promiseCancel = require('promise-cancel');

var _promiseCancel2 = _interopRequireDefault(_promiseCancel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sidebar = function () {
    function Sidebar() {
        var _this = this;

        _classCallCheck(this, Sidebar);

        this.lastRequest = null;

        _EE2.default.on('fred-sidebar-expand', function (cmp, title, icon, data) {
            _this.showSidebar2('<i class="fa fa-spinner fa-spin"></i> LOADING', 'LOADING');

            _this.lastRequest = (0, _promiseCancel2.default)(Promise.resolve(data));
            _this.lastRequest.promise.then(function (content) {
                _this.lastRequest = null;
                _this.showSidebar2('<i class="fa fa-' + icon + '"></i> ' + title, content);
                cmp.afterExpand();
            }).catch(function (err) {
                _this.lastRequest = null;

                if (err.type === 'cancel') {
                    return;
                }

                _this.showSidebar2('<i class="fa fa-exclamation-triangle"></i> ERROR', 'SOMETHING WRONG HAPPENED');
            });
        });

        _EE2.default.on('fred-sidebar-hide', function () {
            _this.hideSidebar();
        });

        _EE2.default.on('fred-sidebar-show', function () {
            _this.showSidebar();
        });
    }

    _createClass(Sidebar, [{
        key: 'render',
        value: function render(wrapper) {
            this.wrapper = document.createElement('div');

            this.closeSidebar = this.closeSidebar.bind(this);
            this.wrapper.appendChild(this.buildOpenButton());
            this.wrapper.appendChild(this.buildSidebar());
            this.wrapper.appendChild(this.buildSidebar2());

            wrapper.appendChild(this.wrapper);

            return this;
        }
    }, {
        key: 'buildSidebar',
        value: function buildSidebar() {
            var _this2 = this;

            this.sidebar = document.createElement('div');
            this.sidebar.classList.add('fred--sidebar');
            this.sidebar.setAttribute('hidden', 'hidden');

            this.close = document.createElement('button');
            this.close.classList.add('fred--sidebar_close');
            this.close.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="-4 -4 20 20" enable-background="new -4 -4 20 20" xml:space="preserve"><polygon points="16.079,-0.666 12.717,-4.027 6.052,2.637 -0.613,-4.027 -3.975,-0.666 2.69,6 -3.975,12.664 -0.612,16.026 6.052,9.362 12.717,16.027 16.079,12.664 9.414,6 "></polygon></svg>';
            this.close.addEventListener('click', function (e) {
                e.preventDefault();
                if (_this2.sidebar2.hasAttribute('hidden') === true) {
                    if (_this2.lastRequest !== null) {
                        _this2.lastRequest.cancel();
                        _this2.lastRequest = null;
                    }
                    _this2.sidebar.setAttribute('hidden', 'hidden');
                    window.removeEventListener('click', _this2.closeSidebar);
                } else {
                    if (_this2.lastRequest !== null) {
                        _this2.lastRequest.cancel();
                        _this2.lastRequest = null;
                    }
                    _this2.sidebar2.setAttribute('hidden', 'hidden');
                }
            });

            var header = document.createElement('div');
            header.classList.add('fred--sidebar_title');
            header.innerHTML = '<img src="images/modx-revo-icon-48.svg" alt="MODX FRED" class="fred--logo"><h1>Fred</h1>';

            var list = document.createElement('dl');
            list.classList.add('fred--accordion');
            list.setAttribute('tabindex', '0');
            list.setAttribute('role', 'tablist');

            list.appendChild(new _Resources2.default());
            list.appendChild(new _Widgets2.default());

            this.sidebar.appendChild(this.close);
            this.sidebar.appendChild(header);
            this.sidebar.appendChild(list);

            return this.sidebar;
        }
    }, {
        key: 'showSidebar2',
        value: function showSidebar2(title, content) {
            this.sidebar2Header.innerHTML = '<span>' + title + '</span>';
            this.sidebar2Content.innerHTML = content;
            this.sidebar2.removeAttribute('hidden');
        }
    }, {
        key: 'buildSidebar2',
        value: function buildSidebar2() {
            this.sidebar2 = document.createElement('div');
            this.sidebar2.classList.add('fred--sidebar_paneltwo', 'active');
            this.sidebar2.setAttribute('hidden', 'hidden');

            var list = document.createElement('dl');
            list.classList.add('fred--accordion');
            list.setAttribute('tabindex', '0');
            list.setAttribute('role', 'tablist');

            this.sidebar2Header = document.createElement('dt');
            this.sidebar2Header.classList.add('active');
            this.sidebar2Header.setAttribute('role', 'tab');
            this.sidebar2Header.setAttribute('tabindex', '0');

            var items = document.createElement('dd');
            items.setAttribute('role', 'tab');
            items.setAttribute('tabindex', '0');

            this.sidebar2Content = document.createElement('div');

            items.appendChild(this.sidebar2Content);

            list.appendChild(this.sidebar2Header);
            list.appendChild(items);

            this.sidebar2.appendChild(list);

            return this.sidebar2;
        }
    }, {
        key: 'buildOpenButton',
        value: function buildOpenButton() {
            var _this3 = this;

            this.open = document.createElement('button');
            this.open.classList.add('fred--open');
            this.open.innerHTML = '<i class="fa fa-angle-right"></i> <i class="fa fa-angle-right"></i>';

            this.open.addEventListener('click', function (e) {
                e.preventDefault();
                _this3.sidebar.removeAttribute('hidden');
                window.addEventListener('click', _this3.closeSidebar);
            });

            return this.open;
        }
    }, {
        key: 'closeSidebar',
        value: function closeSidebar(e) {
            e.preventDefault();

            if (this.lastRequest !== null) {
                this.lastRequest.cancel();
                this.lastRequest = null;
            }

            this.sidebar.setAttribute('hidden', 'hidden');
            this.sidebar2.setAttribute('hidden', 'hidden');

            window.removeEventListener('click', this.closeSidebar);
        }
    }, {
        key: 'hideSidebar',
        value: function hideSidebar() {
            this.wrapper.setAttribute('hidden', 'hidden');
        }
    }, {
        key: 'showSidebar',
        value: function showSidebar() {
            this.wrapper.removeAttribute('hidden');
        }
    }]);

    return Sidebar;
}();

exports.default = Sidebar;
module.exports = exports['default'];