"use strict";
var BetweenTimes = (function () {
    function BetweenTimes(minimumExpected, maximumExpected) {
        this.minimumExpected = minimumExpected;
        this.maximumExpected = maximumExpected;
    }
    BetweenTimes.prototype.match = function (actual) {
        if (actual < this.minimumExpected) {
            return false;
        }
        if (actual > this.maximumExpected) {
            return false;
        }
        return true;
    };
    return BetweenTimes;
}());
exports.BetweenTimes = BetweenTimes;
