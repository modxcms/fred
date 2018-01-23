'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitter = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = exports.emitter = new _events2.default();
exports.default = emitter;