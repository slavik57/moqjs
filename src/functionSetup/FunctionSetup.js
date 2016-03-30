"use strict";
var ReturnsOverrideFunctionCallMode_1 = require('../functionCallMode/ReturnsOverrideFunctionCallMode');
var CallbackOverrideFunctionCallMode_1 = require('../functionCallMode/CallbackOverrideFunctionCallMode');
var ThrowsOverrideFunctionCallMode_1 = require('../functionCallMode/ThrowsOverrideFunctionCallMode');
var InvokeFunctionCallMode_1 = require('../functionCallMode/InvokeFunctionCallMode');
var FunctionSetup = (function () {
    function FunctionSetup(functionCall, object, functionProxyConfigurations) {
        this.functionCall = functionCall;
        this.object = object;
        this.functionProxyConfigurations = functionProxyConfigurations;
    }
    FunctionSetup.prototype.lazyReturns = function (returnFunction) {
        var _this = this;
        var overrideMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return returnFunction.apply(_this.object, args);
        });
        return this._callWithOverrideMode(overrideMode);
    };
    FunctionSetup.prototype.lazyReturnsInOrder = function (returnFunctions) {
        var _this = this;
        var functions = returnFunctions.map(function (func) { return func; });
        var overrideMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (functions.length < 1) {
                return undefined;
            }
            var firstFunction = functions.shift();
            return firstFunction.apply(_this.object, args);
        });
        return this._callWithOverrideMode(overrideMode);
    };
    FunctionSetup.prototype.returns = function (value) {
        var overrideMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(function () {
            return value;
        });
        return this._callWithOverrideMode(overrideMode);
    };
    FunctionSetup.prototype.returnsInOrder = function (values) {
        var itemsToReturnFunctions = values.map(function (value) {
            return function () { return value; };
        });
        return this.lazyReturnsInOrder(itemsToReturnFunctions);
    };
    FunctionSetup.prototype.callback = function (callback) {
        var _this = this;
        var overrideMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            callback.apply(_this.object, args);
        });
        return this._callWithOverrideMode(overrideMode);
    };
    FunctionSetup.prototype.lazyThrows = function (errorReturningFunction) {
        var _this = this;
        var overrideMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return errorReturningFunction.apply(_this.object, args);
        });
        return this._callWithOverrideMode(overrideMode);
    };
    FunctionSetup.prototype.throws = function (error) {
        return this.lazyThrows(function () { return error; });
    };
    FunctionSetup.prototype._callWithOverrideMode = function (overrideMode) {
        this.functionProxyConfigurations.functionCallMode = overrideMode;
        this.functionCall(this.object);
        this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode_1.InvokeFunctionCallMode();
        return this;
    };
    return FunctionSetup;
}());
exports.FunctionSetup = FunctionSetup;
