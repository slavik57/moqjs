'use strict';
var moqJS;
(function (moqJS) {
    var FunctionProxy = (function () {
        function FunctionProxy(originalFunction, thisObject, functionProxyConfigurations) {
            this.originalFunction = originalFunction;
            this.thisObject = thisObject;
            this.functionProxyConfigurations = functionProxyConfigurations;
            this._numberOfTimesCalled = 0;
            this._actualArguments = [];
        }
        FunctionProxy.prototype.callFunction = function (args) {
            if (!this.functionProxyConfigurations.isVerifying) {
                return this._callFunctionWithoutVerification(args);
            } else if (this.functionProxyConfigurations.functionOverride) {
                // TODO: add overrides
            } else {
                this._verifyFunction(args);
            }
        };

        FunctionProxy.prototype._callFunctionWithoutVerification = function (args) {
            // TODO: if has overrides execute each override one by one
            this._numberOfTimesCalled++;
            this._actualArguments.push(args);

            if (this.functionProxyConfigurations.callBase) {
                return this.originalFunction.apply(this.thisObject, args);
            }
        };

        FunctionProxy.prototype._verifyFunction = function (expectedArguments) {
            for (var i = 0; i < this._actualArguments.length; i++) {
                var actualArguments = this._actualArguments[i];

                if (this._doArgumentsMatch(expectedArguments, actualArguments)) {
                    this.functionProxyConfigurations.numberOfMatches++;
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
        return FunctionProxy;
    })();
    moqJS.FunctionProxy = FunctionProxy;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionProxy.js.map
