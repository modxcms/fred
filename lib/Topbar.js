'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Topbar = function () {
    function Topbar(wrapper) {
        _classCallCheck(this, Topbar);

        wrapper.appendChild(this.buildTopBar());

        return this;
    }

    _createClass(Topbar, [{
        key: 'liWrapper',
        value: function liWrapper(node) {
            var li = document.createElement('li');
            li.innerHTML = node.outerHTML;

            return li;
        }
    }, {
        key: 'buildTopBar',
        value: function buildTopBar() {
            var topBar = document.createElement('div');
            topBar.classList.add('fred--topbar', 'fred--clearfix');

            var links = document.createElement('ul');
            links.classList.add('fred--topbar_links');

            var newPage = document.createElement('a');
            newPage.innerHTML = 'New Page <i class="angle-down"></i>';

            var settings = document.createElement('a');
            settings.innerHTML = 'Settings <i class="angle-down"></i>';

            links.appendChild(this.liWrapper(newPage));
            links.appendChild(this.liWrapper(settings));

            var buttons = document.createElement('div');
            buttons.classList.add('fred--topbar_buttons');

            var logout = document.createElement('button');
            logout.classList.add('fred--btn-small');
            logout.innerText = 'Logout';

            buttons.appendChild(logout);

            topBar.appendChild(links);
            topBar.appendChild(buttons);

            return topBar;
        }
    }]);

    return Topbar;
}();

exports.default = Topbar;
module.exports = exports['default'];