'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EE = require('./EE');

var _EE2 = _interopRequireDefault(_EE);

var _Sidebar = require('./Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Topbar = require('./Topbar');

var _Topbar2 = _interopRequireDefault(_Topbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fred = function () {
    function Fred() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Fred);

        this.init();
    }

    _createClass(Fred, [{
        key: 'render',
        value: function render() {
            this.wrapper = document.createElement('div');
            this.wrapper.classList.add('fred');

            this.wrapper.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            new _Topbar2.default(this.wrapper);
            this.sidebar.render(this.wrapper);

            if (document.body.firstChild === null) {
                document.body.appendChild(this.wrapper);
            } else {
                document.body.insertBefore(this.wrapper, document.body.firstChild);
            }
        }
    }, {
        key: 'showFred',
        value: function showFred() {
            this.wrapper.removeAttribute('hidden');
        }
    }, {
        key: 'hideFred',
        value: function hideFred() {
            this.wrapper.setAttribute('hidden', 'hidden');
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            console.log('Hello from Fred!');

            var dropzones = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
            var registeredDropzones = [];

            for (var zoneIndex = 0; zoneIndex < dropzones.length; zoneIndex++) {
                if (registeredDropzones.indexOf(dropzones[zoneIndex].dataset.fredDropzone) != -1) {
                    console.error('There are several dropzones with same name: ' + dropzones[zoneIndex].dataset.fredDropzone + '. The name of each dropzone has to be unique.');
                    return false;
                }

                registeredDropzones.push(dropzones[zoneIndex].dataset.fredDropzone);
            }

            _EE2.default.on('fred-hide', function () {
                _this.hideFred();
            });
            _EE2.default.on('fred-show', function () {
                _this.showFred();
            });

            this.sidebar = new _Sidebar2.default();
            this.render();
        }
    }]);

    return Fred;
}();

exports.default = Fred;
module.exports = exports['default'];