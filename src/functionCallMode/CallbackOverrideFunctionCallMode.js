"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OverrideFunctionCallMode_1 = require('./OverrideFunctionCallMode');
var CallbackOverrideFunctionCallMode = (function (_super) {
    __extends(CallbackOverrideFunctionCallMode, _super);
    function CallbackOverrideFunctionCallMode(callbackFunction) {
        _super.call(this, callbackFunction);
        this.callbackFunction = callbackFunction;
    }
    return CallbackOverrideFunctionCallMode;
}(OverrideFunctionCallMode_1.OverrideFunctionCallMode));
exports.CallbackOverrideFunctionCallMode = CallbackOverrideFunctionCallMode;
