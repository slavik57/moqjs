"use strict";
var ItIsAny_1 = require('./ItIsAny');
var ItIs_1 = require('./ItIs');
var ItIsInRange_1 = require('./ItIsInRange');
var ItIsRegex_1 = require('./ItIsRegex');
var It = (function () {
    function It() {
    }
    It.isAny = function (type) {
        return new ItIsAny_1.ItIsAny(type);
    };
    It.is = function (predicate) {
        return new ItIs_1.ItIs(predicate);
    };
    It.isInRange = function (minimumValue, maximumValue) {
        return new ItIsInRange_1.ItIsInRange(minimumValue, maximumValue);
    };
    It.isRegExp = function (regExp) {
        return new ItIsRegex_1.ItIsRegex(regExp);
    };
    return It;
}());
exports.It = It;
