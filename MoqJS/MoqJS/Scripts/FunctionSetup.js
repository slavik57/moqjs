'use strict';
var moqJS;
(function (moqJS) {
    var FunctionSetup = (function () {
        function FunctionSetup(functionCall, object, functionProxyConfigurations) {
            this.functionCall = functionCall;
            this.object = object;
            this.functionProxyConfigurations = functionProxyConfigurations;
        }
        // TODO: add returnsInOrder and lazyReturnsInOrder....
        //  given list of return values return every call the next value... when finished return undefined
        // TODO: add lazyThrows
        FunctionSetup.prototype.lazyReturns = function (returnFunction) {
            var _this = this;
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return returnFunction.apply(_this.object, args);
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();

            return this;
        };

        FunctionSetup.prototype.returns = function (value) {
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                return value;
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();

            return this;
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

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();

            return this;
        };

        FunctionSetup.prototype.throws = function (error) {
            var overrideMode = new moqJS.ThrowsOverrideFunctionCallMode(function () {
                return error;
            });

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
