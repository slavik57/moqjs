'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mockJS;
(function (mockJS) {
    var TimesBase = (function () {
        function TimesBase(expected) {
            this.expected = expected;
        }
        TimesBase.prototype.match = function (actual) {
            return false;
        };
        return TimesBase;
    })();

    var LessTimes = (function (_super) {
        __extends(LessTimes, _super);
        function LessTimes(expected) {
            _super.call(this, expected);
        }
        LessTimes.prototype.match = function (actual) {
            return actual < this.expected;
        };
        return LessTimes;
    })(TimesBase);

    var AtMostTimes = (function (_super) {
        __extends(AtMostTimes, _super);
        function AtMostTimes(expected) {
            _super.call(this, expected);
        }
        AtMostTimes.prototype.match = function (actual) {
            return actual <= this.expected;
        };
        return AtMostTimes;
    })(TimesBase);

    var ExactTimes = (function (_super) {
        __extends(ExactTimes, _super);
        function ExactTimes(expected) {
            _super.call(this, expected);
        }
        ExactTimes.prototype.match = function (actual) {
            return actual === this.expected;
        };
        return ExactTimes;
    })(TimesBase);

    var AtLeastTimes = (function (_super) {
        __extends(AtLeastTimes, _super);
        function AtLeastTimes(expected) {
            _super.call(this, expected);
        }
        AtLeastTimes.prototype.match = function (actual) {
            return actual >= this.expected;
        };
        return AtLeastTimes;
    })(TimesBase);

    var MoreTimes = (function (_super) {
        __extends(MoreTimes, _super);
        function MoreTimes(expected) {
            _super.call(this, expected);
        }
        MoreTimes.prototype.match = function (actual) {
            return actual > this.expected;
        };
        return MoreTimes;
    })(TimesBase);

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
    })();

    var Times = (function () {
        function Times() {
        }
        Times.lessThan = function (expected) {
            return new LessTimes(expected);
        };

        Times.atMost = function (expected) {
            return new AtMostTimes(expected);
        };

        Times.exact = function (expected) {
            return new ExactTimes(expected);
        };

        Times.atLeast = function (expected) {
            return new AtLeastTimes(expected);
        };

        Times.moreThan = function (expected) {
            return new MoreTimes(expected);
        };

        Times.between = function (minimum, maximum) {
            return new BetweenTimes(minimum, maximum);
        };
        return Times;
    })();
    mockJS.Times = Times;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=Times.js.map
