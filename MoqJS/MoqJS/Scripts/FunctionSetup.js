'use strict';
var moqJS;
(function (moqJS) {
    var FunctionSetup = (function () {
        function FunctionSetup(functionCall, object, functionProxyConfigurations) {
            this.functionCall = functionCall;
            this.object = object;
            this.functionProxyConfigurations = functionProxyConfigurations;
        }
        FunctionSetup.prototype.lazyReturns = function (returnFunction) {
            var _this = this;
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return returnFunction.apply(_this.object, args);
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.lazyReturnsInOrder = function (returnFunctions) {
            var _this = this;
            // NOTE: Clone to keep all given values and not change the orinial array
            var functions = returnFunctions.map(function (func) {
                return func;
            });

            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
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
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                return value;
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.returnsInOrder = function (values) {
            var itemsToReturnFunctions = values.map(function (value) {
                return function () {
                    return value;
                };
            });

            return this.lazyReturnsInOrder(itemsToReturnFunctions);
        };

        FunctionSetup.prototype.callback = function (callback) {
            var _this = this;
            var overrideMode = new moqJS.CallbackOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                callback.apply(_this.object, args);
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.lazyThrows = function (errorReturningFunction) {
            var _this = this;
            var overrideMode = new moqJS.ThrowsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return errorReturningFunction.apply(_this.object, args);
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.throws = function (error) {
            return this.lazyThrows(function () {
                return error;
            });
        };

        FunctionSetup.prototype._callWithOverrideMode = function (overrideMode) {
            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();

            return this;
        };
        return FunctionSetup;
    })();
    moqJS.FunctionSetup = FunctionSetup;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionSetup.js.map
