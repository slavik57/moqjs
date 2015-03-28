'use strict';
var moqJS;
(function (moqJS) {
    var ArgumentsWithOverrides = (function () {
        function ArgumentsWithOverrides(exptectedArguments, override) {
            this.exptectedArguments = exptectedArguments;
            this.override = override;
        }
        return ArgumentsWithOverrides;
    })();

    var FunctionExecutionResult;
    (function (FunctionExecutionResult) {
        FunctionExecutionResult[FunctionExecutionResult["ThrowError"] = 0] = "ThrowError";
        FunctionExecutionResult[FunctionExecutionResult["ReturnValue"] = 1] = "ReturnValue";
        FunctionExecutionResult[FunctionExecutionResult["DoNothing"] = 2] = "DoNothing";
    })(FunctionExecutionResult || (FunctionExecutionResult = {}));

    var FunctionProxy = (function () {
        function FunctionProxy(originalFunction, thisObject, functionProxyConfigurations) {
            this.originalFunction = originalFunction;
            this.thisObject = thisObject;
            this.functionProxyConfigurations = functionProxyConfigurations;
            this._numberOfTimesCalled = 0;
            this._actualArguments = [];
            this._argumentsWithOverridesList = [];
        }
        FunctionProxy.prototype.callFunction = function (args) {
            if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.InvokeFunctionCallMode) {
                return this._callFunctionWithoutVerification(args);
            } else if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.OverrideFunctionCallMode) {
                this._addOverride(args, this.functionProxyConfigurations.functionCallMode);
            } else if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.VerifyFunctionCallMode) {
                this._verifyFunction(args, this.functionProxyConfigurations.functionCallMode);
            } else {
                throw 'not supported functionCallMode';
            }
        };

        FunctionProxy.prototype._callFunctionWithoutVerification = function (actualArguments) {
            this._numberOfTimesCalled++;
            this._actualArguments.push(actualArguments);

            var matchingOverrides = this._getMatchingOverrides(actualArguments);
            if (matchingOverrides.length > 0) {
                return this._executeOverrides(matchingOverrides, actualArguments);
            }

            if (this.functionProxyConfigurations.isStrict) {
                throw 'No function setups defined and using strict mode. Change "isStrict" to false or define a function setup';
            }

            if (this.functionProxyConfigurations.callBase) {
                return this.originalFunction.apply(this.thisObject, actualArguments);
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
            var functionExecutionResult = 2 /* DoNothing */;

            var lastError;
            var lastResult;

            for (var i = 0; i < overrides.length; i++) {
                var override = overrides[i];

                if (override instanceof moqJS.ThrowsOverrideFunctionCallMode) {
                    functionExecutionResult = 0 /* ThrowError */;
                    lastError = override.override.apply(this.thisObject, args);
                    continue;
                }

                if (override instanceof moqJS.ReturnsOverrideFunctionCallMode) {
                    functionExecutionResult = 1 /* ReturnValue */;
                    lastResult = override.override.apply(this.thisObject, args);
                    continue;
                }

                if (override instanceof moqJS.CallbackOverrideFunctionCallMode) {
                    override.override.apply(this.thisObject, args);
                    continue;
                }
            }

            switch (functionExecutionResult) {
                case 1 /* ReturnValue */:
                    return lastResult;
                case 0 /* ThrowError */:
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
            var itIsItIsBase = moqJS.It.isAny(moqJS.ItIsBase);

            if (!itIsItIsBase.match(expected)) {
                return actual === expected;
            }

            var expectedItIsBase = expected;

            return expectedItIsBase.match(actual);
        };

        FunctionProxy.prototype._addOverride = function (expectedArguments, overrideMode) {
            var argumentsWithOverrides = new ArgumentsWithOverrides(expectedArguments, overrideMode);

            this._argumentsWithOverridesList.push(argumentsWithOverrides);
        };
        return FunctionProxy;
    })();
    moqJS.FunctionProxy = FunctionProxy;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionProxy.js.map
