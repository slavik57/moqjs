"use strict";
var ArgumentsWithOverrides_1 = require('./ArgumentsWithOverrides');
var FunctionExecutionResult_1 = require('./FunctionExecutionResult');
var InvokeFunctionCallMode_1 = require('../functionCallMode/InvokeFunctionCallMode');
var OverrideFunctionCallMode_1 = require('../functionCallMode/OverrideFunctionCallMode');
var VerifyFunctionCallMode_1 = require('../functionCallMode/VerifyFunctionCallMode');
var ThrowsOverrideFunctionCallMode_1 = require('../functionCallMode/ThrowsOverrideFunctionCallMode');
var ReturnsOverrideFunctionCallMode_1 = require('../functionCallMode/ReturnsOverrideFunctionCallMode');
var CallbackOverrideFunctionCallMode_1 = require('../functionCallMode/CallbackOverrideFunctionCallMode');
var ItIsBase_1 = require('../it/ItIsBase');
var It_1 = require('../it/It');
var Mole_1 = require('../Mole');
var FunctionProxy = (function () {
    function FunctionProxy(originalFunctionName, originalFunction, thisObject, functionProxyConfigurations) {
        this.originalFunctionName = originalFunctionName;
        this.originalFunction = originalFunction;
        this.thisObject = thisObject;
        this.functionProxyConfigurations = functionProxyConfigurations;
        this._numberOfTimesCalled = 0;
        this._actualArguments = [];
        this._argumentsWithOverridesList = [];
    }
    FunctionProxy.prototype.callFunction = function (args) {
        if (this.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode_1.InvokeFunctionCallMode) {
            return this._callFunctionWithoutVerification(args);
        }
        else if (this.functionProxyConfigurations.functionCallMode instanceof OverrideFunctionCallMode_1.OverrideFunctionCallMode) {
            this._addOverride(args, this.functionProxyConfigurations.functionCallMode);
        }
        else if (this.functionProxyConfigurations.functionCallMode instanceof VerifyFunctionCallMode_1.VerifyFunctionCallMode) {
            this._verifyFunction(args, this.functionProxyConfigurations.functionCallMode);
        }
        else {
            throw 'not supported functionCallMode';
        }
    };
    FunctionProxy.prototype._callFunctionWithoutVerification = function (actualArguments) {
        this._numberOfTimesCalled++;
        this._actualArguments.push(actualArguments);
        var matchingOverrides = this._getMatchingOverrides(actualArguments);
        if (matchingOverrides.length > 0) {
            var returnValue = this._executeOverrides(matchingOverrides, actualArguments);
            return this._moleReturnValueIfNeeded(returnValue);
        }
        if (this.functionProxyConfigurations.isStrict) {
            throw 'No function setups defined and using strict mode. Change "isStrict" to false or define a function setup';
        }
        if (this.functionProxyConfigurations.callBase) {
            var returnValue = this.originalFunction.apply(this.thisObject, actualArguments);
            return this._moleReturnValueIfNeeded(returnValue);
        }
    };
    FunctionProxy.prototype._getMatchingOverrides = function (actualArguments) {
        var result = [];
        for (var i = 0; i < this._argumentsWithOverridesList.length; i++) {
            var argumentsWithOverrides = this._argumentsWithOverridesList[i];
            if (this._doArgumentsMatch(argumentsWithOverrides.exptectedArguments, actualArguments)) {
                result.push(argumentsWithOverrides.override);
            }
        }
        return result;
    };
    FunctionProxy.prototype._executeOverrides = function (overrides, args) {
        var functionExecutionResult = FunctionExecutionResult_1.FunctionExecutionResult.DoNothing;
        var lastError;
        var lastResult;
        for (var i = 0; i < overrides.length; i++) {
            var override = overrides[i];
            if (override instanceof ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode) {
                functionExecutionResult = FunctionExecutionResult_1.FunctionExecutionResult.ThrowError;
                lastError = override.override.apply(this.thisObject, args);
                continue;
            }
            if (override instanceof ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode) {
                functionExecutionResult = FunctionExecutionResult_1.FunctionExecutionResult.ReturnValue;
                lastResult = override.override.apply(this.thisObject, args);
                continue;
            }
            if (override instanceof CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode) {
                override.override.apply(this.thisObject, args);
                continue;
            }
        }
        switch (functionExecutionResult) {
            case FunctionExecutionResult_1.FunctionExecutionResult.ReturnValue:
                return lastResult;
            case FunctionExecutionResult_1.FunctionExecutionResult.ThrowError:
                throw lastError;
        }
    };
    FunctionProxy.prototype._verifyFunction = function (expectedArguments, verifyFunctionCallMode) {
        for (var i = 0; i < this._actualArguments.length; i++) {
            var actualArguments = this._actualArguments[i];
            if (this._doArgumentsMatch(expectedArguments, actualArguments)) {
                verifyFunctionCallMode.numberOfMatches++;
            }
        }
    };
    FunctionProxy.prototype._doArgumentsMatch = function (expectedArguments, actualArguments) {
        if (expectedArguments.length !== actualArguments.length) {
            return false;
        }
        if (expectedArguments.length === 0) {
            return true;
        }
        for (var i = 0; i < expectedArguments.length; i++) {
            if (!this._isSameArgument(actualArguments[i], expectedArguments[i])) {
                return false;
            }
        }
        return true;
    };
    FunctionProxy.prototype._isSameArgument = function (actual, expected) {
        var itIsItIsBase = It_1.It.isAny(ItIsBase_1.ItIsBase);
        if (!itIsItIsBase.match(expected)) {
            return actual === expected;
        }
        var expectedItIsBase = expected;
        return expectedItIsBase.match(actual);
    };
    FunctionProxy.prototype._addOverride = function (expectedArguments, overrideMode) {
        var argumentsWithOverrides = new ArgumentsWithOverrides_1.ArgumentsWithOverrides(expectedArguments, overrideMode);
        this._argumentsWithOverridesList.push(argumentsWithOverrides);
    };
    FunctionProxy.prototype._moleReturnValueIfNeeded = function (returnValue) {
        if (this.functionProxyConfigurations.moleReturnValue) {
            var mole = new Mole_1.Mole(returnValue);
            mole.moleReturnValue = true;
        }
        return returnValue;
    };
    return FunctionProxy;
}());
exports.FunctionProxy = FunctionProxy;
