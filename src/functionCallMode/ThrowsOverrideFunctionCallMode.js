"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OverrideFunctionCallMode_1 = require('./OverrideFunctionCallMode');
var ThrowsOverrideFunctionCallMode = (function (_super) {
    __extends(ThrowsOverrideFunctionCallMode, _super);
    function ThrowsOverrideFunctionCallMode(getErrorToThrow) {
        _super.call(this, getErrorToThrow);
        this.getErrorToThrow = getErrorToThrow;
    }
    return ThrowsOverrideFunctionCallMode;
}(OverrideFunctionCallMode_1.OverrideFunctionCallMode));
exports.ThrowsOverrideFunctionCallMode = ThrowsOverrideFunctionCallMode;
