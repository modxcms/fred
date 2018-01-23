'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sidebar2 = require('../Sidebar');

var _Sidebar3 = _interopRequireDefault(_Sidebar2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Resources = function (_Sidebar) {
    _inherits(Resources, _Sidebar);

    function Resources() {
        _classCallCheck(this, Resources);

        return _possibleConstructorReturn(this, (Resources.__proto__ || Object.getPrototypeOf(Resources)).apply(this, arguments));
    }

    _createClass(Resources, [{
        key: 'click',
        value: function click() {
            var content = '<div>THIS IS A DELAYED TEST CONTENT</div>';

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(content);
                }, 10000);
            });
        }
    }]);

    return Resources;
}(_Sidebar3.default);

Resources.title = 'Resources';
Resources.icon = 'file-o';
Resources.expandable = true;
exports.default = Resources;
module.exports = exports['default'];