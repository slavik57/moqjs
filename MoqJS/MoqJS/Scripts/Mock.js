'use strict';
var moqJS;
(function (moqJS) {
    // TODO: Implement:
    //  setup
    //  if has no setup should throw exception = strict
    //  setup get
    //  setup set
    // Get the mock by the object instace...
    // from all the created mocks get the one that behaves like this:( mock => boolean )
    var Mock = (function () {
        function Mock(object) {
            this.object = object;
            this._FunctionProxyConfigurations = new moqJS.FunctionProxyConfigurations();
            this._FunctionProxyConfigurations.callBase = true;

            this._setFunctionProxies();
        }
        Object.defineProperty(Mock.prototype, "callBase", {
            get: function () {
                return this._FunctionProxyConfigurations.callBase;
            },
            set: function (value) {
                this._FunctionProxyConfigurations.callBase = value;
            },
            enumerable: true,
            configurable: true
        });


        // TODO: Tests
        // setup private using string
        Mock.prototype.setup = function (functionCall) {
            return new moqJS.FunctionSetup(functionCall, this.object, this._FunctionProxyConfigurations);
        };

        Mock.prototype.verify = function (functionCall, times) {
            var verifyMode = new moqJS.VerifyFunctionCallMode();
            this._FunctionProxyConfigurations.functionCallMode = verifyMode;

            functionCall(this.object);

            this._FunctionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();

            var numberOfMatches = verifyMode.numberOfMatches;
            if (!times) {
                return numberOfMatches > 0;
            }

            return times.match(numberOfMatches);
        };

        Mock.prototype._setFunctionProxies = function () {
            var proxies = [];

            for (var propertyName in this.object) {
                var propertyValue = this.object[propertyName];

                if (typeof (propertyValue) != "function") {
                    continue;
                }

                var functionProxy = new moqJS.FunctionProxy(propertyValue, this.object, this._FunctionProxyConfigurations);
                proxies.push(functionProxy);

                this._setFunctionProxy(proxies, proxies.length - 1, propertyName);
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
    moqJS.Mock = Mock;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=Mock.js.map
