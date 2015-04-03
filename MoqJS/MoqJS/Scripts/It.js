'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var moqJS;
(function (moqJS) {
    var ItIsBase = (function () {
        function ItIsBase() {
        }
        ItIsBase.prototype.match = function (argument) {
            return false;
        };
        return ItIsBase;
    })();
    moqJS.ItIsBase = ItIsBase;

    var ItIsAny = (function (_super) {
        __extends(ItIsAny, _super);
        function ItIsAny(expectedType) {
            _super.call(this);
            this.expectedType = expectedType;
        }
        ItIsAny.prototype.match = function (argument) {
            if (argument === null || argument === undefined) {
                return false;
            }

            return argument.constructor === this.expectedType || argument instanceof this.expectedType;
        };
        return ItIsAny;
    })(ItIsBase);

    var ItIs = (function (_super) {
        __extends(ItIs, _super);
        function ItIs(predicate) {
            _super.call(this);
            this.predicate = predicate;
        }
        ItIs.prototype.match = function (argument) {
            return this.predicate(argument);
        };
        return ItIs;
    })(ItIsBase);

    var ItIsInRange = (function (_super) {
        __extends(ItIsInRange, _super);
        function ItIsInRange(minimumValue, maximumValue) {
            _super.call(this);
            this.minimumValue = minimumValue;
            this.maximumValue = maximumValue;
        }
        ItIsInRange.prototype.match = function (argument) {
            if (isNaN(argument)) {
                return false;
            }

            return this.minimumValue <= argument && argument <= this.maximumValue;
        };
        return ItIsInRange;
    })(ItIsBase);

    var ItIsRegex = (function (_super) {
        __extends(ItIsRegex, _super);
        function ItIsRegex(regExp) {
            _super.call(this);
            this.regExp = regExp;
        }
        ItIsRegex.prototype.match = function (argument) {
            if (!this._isString(argument)) {
                return false;
            }

            return this.regExp.test(argument);
        };

        ItIsRegex.prototype._isString = function (argument) {
            var isString = new ItIsAny(String);

            return isString.match(argument);
        };
        return ItIsRegex;
    })(ItIsBase);

    var It = (function () {
        function It() {
        }
        It.isAny = function (type) {
            return new ItIsAny(type);
        };

        It.is = function (predicate) {
            return new ItIs(predicate);
        };

        It.isInRange = function (minimumValue, maximumValue) {
            return new ItIsInRange(minimumValue, maximumValue);
        };

        It.isRegExp = function (regExp) {
            return new ItIsRegex(regExp);
        };
        return It;
    })();
    moqJS.It = It;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=It.js.map
