'use strict';
var mockJS;
(function (mockJS) {
    var Mock = (function () {
        function Mock(object) {
            this.object = object;
            this._FunctionProxyConfigurations = new mockJS.FunctionProxyConfigurations();

            this._setFunctionProxies();
        }
        Mock.prototype.Verify = function (functionCall) {
            this._FunctionProxyConfigurations.isVerifying = true;
            this._FunctionProxyConfigurations.hasMatch = false;

            functionCall(this.object);

            var hasMatch = this._FunctionProxyConfigurations.hasMatch;

            this._FunctionProxyConfigurations.isVerifying = false;
            this._FunctionProxyConfigurations.hasMatch = false;

            return hasMatch;
        };

        Mock.prototype._setFunctionProxies = function () {
            for (var propertyName in this.object) {
                var propertyValue = this.object[propertyName];

                if (typeof (propertyValue) != "function") {
                    continue;
                }

                var functionProxy = new mockJS.FunctionProxy(propertyValue, this.object, this._FunctionProxyConfigurations);
                this.object[propertyName] = function () {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        args[_i] = arguments[_i + 0];
                    }
                    return functionProxy.callFunction(args);
                };
            }
        };
        return Mock;
    })();
    mockJS.Mock = Mock;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=Mock.js.map
