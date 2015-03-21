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
            var functionOverride = new moqJS.FunctionOverride(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return returnFunction.apply(_this.object, args);
            }, 1 /* LazyReturns */);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };

        FunctionSetup.prototype.returns = function (value) {
            var functionOverride = new moqJS.FunctionOverride(function () {
                return value;
            }, 0 /* Returns */);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };

        FunctionSetup.prototype.callback = function (callback) {
            var _this = this;
            var functionOverride = new moqJS.FunctionOverride(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                callback.apply(_this.object, args);
            }, 3 /* Callback */);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };

        FunctionSetup.prototype.throws = function (error) {
            var functionOverride = new moqJS.FunctionOverride(function () {
                throw error;
            }, 2 /* Throws */);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };
        return FunctionSetup;
    })();
    moqJS.FunctionSetup = FunctionSetup;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionSetup.js.map
