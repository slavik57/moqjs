"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItIsBase_1 = require('./ItIsBase');
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
}(ItIsBase_1.ItIsBase));
exports.ItIsInRange = ItIsInRange;
