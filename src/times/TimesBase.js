"use strict";
var TimesBase = (function () {
    function TimesBase(expected) {
        this.expected = expected;
    }
    TimesBase.prototype.match = function (actual) {
        return false;
    };
    return TimesBase;
}());
exports.TimesBase = TimesBase;
