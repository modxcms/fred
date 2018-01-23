'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EE = require('../EE');

var _EE2 = _interopRequireDefault(_EE);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sidebar = function () {
    function Sidebar() {
        var _this = this;

        _classCallCheck(this, Sidebar);

        var render = function render(text, icon) {
            var expandable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '0');
            dt.innerHTML = (expandable === true ? '<i class="fa fa-angle-left fred--accordion_toggle"></i>' : '') + '<span><i class="fa fa-' + icon + '"></i> ' + text + '</span>';

            if (expandable === false) {
                dt.addEventListener('click', _this.click);
            } else {
                dt.addEventListener('click', function () {
                    _EE2.default.emit('fred-sidebar-expand', _this, text, icon, _this.click());
                });
            }

            return dt;
        };

        this.init();

        return render(this.constructor.title, this.constructor.icon, this.constructor.expandable);
    }

    _createClass(Sidebar, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'click',
        value: function click() {}
    }, {
        key: 'afterExpand',
        value: function afterExpand() {}
    }]);

    return Sidebar;
}();

Sidebar.title = 'TITLE NOT SET';
Sidebar.icon = 'modx';
Sidebar.expandable = false;
exports.default = Sidebar;
module.exports = exports['default'];