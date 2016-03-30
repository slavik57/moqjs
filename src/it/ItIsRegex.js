"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItIsBase_1 = require('./ItIsBase');
var ItIsAny_1 = require('./ItIsAny');
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
        var isString = new ItIsAny_1.ItIsAny(String);
        return isString.match(argument);
    };
    return ItIsRegex;
}(ItIsBase_1.ItIsBase));
exports.ItIsRegex = ItIsRegex;
