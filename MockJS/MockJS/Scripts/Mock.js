'use strict';
var mockJS;
(function (mockJS) {
    var Mock = (function () {
        function Mock(object) {
            this.object = object;
            this._FunctionProxyConfigurations = new mockJS.FunctionProxyConfigurations();

            this._setFunctionProxies();
        }
        Mock.prototype.verify = function (functionCall, expectedNumberOfMathches) {
            this._FunctionProxyConfigurations.isVerifying = true;
            this._FunctionProxyConfigurations.numberOfMatches = 0;

            functionCall(this.object);

            var numberOfMatches = this._FunctionProxyConfigurations.numberOfMatches;

            this._FunctionProxyConfigurations.isVerifying = false;
            this._FunctionProxyConfigurations.numberOfMatches = 0;

            if (isNaN(expectedNumberOfMathches)) {
                return numberOfMatches > 0;
            }

            return numberOfMatches === expectedNumberOfMathches;
        };

        Mock.prototype._setFunctionProxies = function () {
            var proxies = [];

            for (var propertyName in this.object) {
                var propertyValue = this.object[propertyName];

                if (typeof (propertyValue) != "function") {
                    continue;
                }

                var functionProxy = new mockJS.FunctionProxy(propertyValue, this.object, this._FunctionProxyConfigurations);
                proxies.push(functionProxy);

                this._setFunctionProxy(proxies, proxies.length - 1, propertyName);
                //this.object[propertyName] = (...args: any[]) => {
                //    functionProxy.callFunction(args);
                //}
            }
        };

        Mock.prototype._setFunctionProxy = function (proxies, proxyNumber, functionName) {
            this.object[functionName] = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return proxies[proxyNumber].callFunction(args);
            };
        };
        return Mock;
    })();
    mockJS.Mock = Mock;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=Mock.js.map
