'use strict';
var moqJS;
(function (moqJS) {
    // TODO: Implement:
    //  Mock wrapping mole
    //  setup get
    //  setup set
    // Get the mock by the object instace...
    // from all the created mocks get the one that behaves like this:( mock => boolean )
    var Mole = (function () {
        function Mole(object) {
            this.object = object;
            this._FunctionProxyConfigurations = new moqJS.FunctionProxyConfigurations();
            this._FunctionProxyConfigurations.callBase = true;

            this._setFunctionProxies();
        }
        Mole.prototype.dispose = function () {
        };

        Object.defineProperty(Mole.prototype, "callBase", {
            get: function () {
                return this._FunctionProxyConfigurations.callBase;
            },
            set: function (value) {
                this._FunctionProxyConfigurations.callBase = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Mole.prototype, "isStrict", {
            get: function () {
                return this._FunctionProxyConfigurations.isStrict;
            },
            set: function (value) {
                this._FunctionProxyConfigurations.isStrict = value;
            },
            enumerable: true,
            configurable: true
        });


        Mole.prototype.setup = function (functionCall) {
            return new moqJS.FunctionSetup(functionCall, this.object, this._FunctionProxyConfigurations);
        };

        Mole.prototype.setupPrivate = function (privateFunctionName) {
            var functionArguments = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                functionArguments[_i] = arguments[_i + 1];
            }
            var functionCall = function (object) {
                var privateFunction = object[privateFunctionName];
                privateFunction.apply(object, functionArguments);
            };

            return this.setup(functionCall);
        };

        Mole.prototype.verify = function (functionCall, times) {
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

        Mole.prototype.verifyPrivate = function (privateFunctionName, functionArguments, times) {
            var functionCall = function (object) {
                var privateFunction = object[privateFunctionName];
                privateFunction.apply(object, functionArguments);
            };

            return this.verify(functionCall, times);
        };

        Mole.prototype._setFunctionProxies = function () {
            var proxies = [];

            var propertyNames = Object.getOwnPropertyNames(this.object);

            for (var i = 0; i < propertyNames.length; i++) {
                var propertyName = propertyNames[i];
                var propertyValue = this.object[propertyName];

                if (typeof (propertyValue) != "function") {
                    continue;
                }

                var functionProxy = new moqJS.FunctionProxy(propertyName, propertyValue, this.object, this._FunctionProxyConfigurations);
                proxies.push(functionProxy);

                this._setFunctionProxy(proxies, proxies.length - 1, propertyName);
            }
        };

        Mole.prototype._setFunctionProxy = function (proxies, proxyNumber, functionName) {
            this.object[functionName] = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return proxies[proxyNumber].callFunction(args);
            };
        };
        return Mole;
    })();
    moqJS.Mole = Mole;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=Mole.js.map
