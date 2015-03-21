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
            // TODO: implement
        };

        FunctionSetup.prototype.returns = function (value) {
            this.functionProxyConfigurations.functionOverride = function () {
                return value;
            };

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };

        FunctionSetup.prototype.callback = function (callback) {
            var _this = this;
            this.functionProxyConfigurations.functionOverride = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                callback.apply(_this.object, args);
            };

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };

        FunctionSetup.prototype.throws = function (error) {
            this.functionProxyConfigurations.functionOverride = function () {
                throw error;
            };

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        };
        return FunctionSetup;
    })();
    moqJS.FunctionSetup = FunctionSetup;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionSetup.js.map
