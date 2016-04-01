"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItIsBase_1 = require('./ItIsBase');
var ItIsAny = (function (_super) {
    __extends(ItIsAny, _super);
    function ItIsAny(expectedType) {
        _super.call(this);
        this.expectedType = expectedType;
    }
    ItIsAny.prototype.match = function (argument) {
        if (argument === null ||
            argument === undefined) {
            return false;
        }
        return argument.constructor === this.expectedType ||
            argument instanceof this.expectedType;
    };
    return ItIsAny;
}(ItIsBase_1.ItIsBase));
exports.ItIsAny = ItIsAny;
