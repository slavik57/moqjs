"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OverrideFunctionCallMode_1 = require('./OverrideFunctionCallMode');
var ReturnsOverrideFunctionCallMode = (function (_super) {
    __extends(ReturnsOverrideFunctionCallMode, _super);
    function ReturnsOverrideFunctionCallMode(getReturnValue) {
        _super.call(this, getReturnValue);
        this.getReturnValue = getReturnValue;
    }
    return ReturnsOverrideFunctionCallMode;
}(OverrideFunctionCallMode_1.OverrideFunctionCallMode));
exports.ReturnsOverrideFunctionCallMode = ReturnsOverrideFunctionCallMode;
