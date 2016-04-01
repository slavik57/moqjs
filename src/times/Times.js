"use strict";
var LessTimes_1 = require('./LessTimes');
var AtMostTimes_1 = require('./AtMostTimes');
var ExactTimes_1 = require('./ExactTimes');
var AtLeastTimes_1 = require('./AtLeastTimes');
var MoreTimes_1 = require('./MoreTimes');
var BetweenTimes_1 = require('./BetweenTimes');
var Times = (function () {
    function Times() {
    }
    Times.lessThan = function (expected) {
        return new LessTimes_1.LessTimes(expected);
    };
    Times.atMost = function (expected) {
        return new AtMostTimes_1.AtMostTimes(expected);
    };
    Times.exact = function (expected) {
        return new ExactTimes_1.ExactTimes(expected);
    };
    Times.atLeast = function (expected) {
        return new AtLeastTimes_1.AtLeastTimes(expected);
    };
    Times.moreThan = function (expected) {
        return new MoreTimes_1.MoreTimes(expected);
    };
    Times.between = function (minimum, maximum) {
        return new BetweenTimes_1.BetweenTimes(minimum, maximum);
    };
    return Times;
}());
exports.Times = Times;
