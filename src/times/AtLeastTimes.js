"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TimesBase_1 = require('./TimesBase');
var AtLeastTimes = (function (_super) {
    __extends(AtLeastTimes, _super);
    function AtLeastTimes(expected) {
        _super.call(this, expected);
    }
    AtLeastTimes.prototype.match = function (actual) {
        return actual >= this.expected;
    };
    return AtLeastTimes;
}(TimesBase_1.TimesBase));
exports.AtLeastTimes = AtLeastTimes;
