﻿'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mockJS;
(function (mockJS) {
    var ItIsBase = (function () {
        function ItIsBase() {
        }
        ItIsBase.prototype.match = function (argument) {
            return false;
        };
        return ItIsBase;
    })();
    mockJS.ItIsBase = ItIsBase;

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

    var It = (function () {
        function It() {
        }
        It.isAny = function (type) {
            return new ItIsAny(type);
        };

        It.is = function (predicate) {
            // TODO...
            return null;
        };
        return It;
    })();
    mockJS.It = It;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=It.js.map
