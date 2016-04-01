"use strict";
var InvokeFunctionCallMode_1 = require('../functionCallMode/InvokeFunctionCallMode');
var FunctionProxyConfigurations = (function () {
    function FunctionProxyConfigurations() {
        this.callBase = true;
        this.isStrict = false;
        this.moleReturnValue = false;
        this.functionCallMode = new InvokeFunctionCallMode_1.InvokeFunctionCallMode();
    }
    return FunctionProxyConfigurations;
}());
exports.FunctionProxyConfigurations = FunctionProxyConfigurations;
