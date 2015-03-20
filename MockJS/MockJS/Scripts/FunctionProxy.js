'use strict';
var mockJS;
(function (mockJS) {
    var FunctionProxy = (function () {
        function FunctionProxy(functionToWrap, thisObject, functionProxyConfigurations) {
            this.functionToWrap = functionToWrap;
            this.thisObject = thisObject;
            this.functionProxyConfigurations = functionProxyConfigurations;
            this._numberOfTimesCalled = 0;
            this._argumentsOfCalls = [];
        }
        FunctionProxy.prototype.callFunction = function (args) {
            if (!this.functionProxyConfigurations.isVerifying) {
                this._callFunctionWithoutVerification(args);
            } else {
                this._verifyFunction(args);
            }
        };

        FunctionProxy.prototype._callFunctionWithoutVerification = function (args) {
            this._numberOfTimesCalled++;
            this._argumentsOfCalls.push(args);

            this.functionToWrap.apply(this.thisObject, args);
        };

        FunctionProxy.prototype._verifyFunction = function (args) {
            for (var i = 0; i < this._argumentsOfCalls.length; i++) {
                var argumentOfCall = this._argumentsOfCalls[i];

                if (this._doArgumentsMatch(args, argumentOfCall)) {
                    this.functionProxyConfigurations.numberOfMatches++;
                }
            }
        };

        FunctionProxy.prototype._doArgumentsMatch = function (args, argumentsOfCall) {
            if (args.length !== argumentsOfCall.length) {
                return false;
            }

            if (args.length === 0) {
                return true;
            }

            for (var i = 0; i < args.length; i++) {
                if (args[i] !== argumentsOfCall[i]) {
                    return false;
                }
            }

            return true;
        };
        return FunctionProxy;
    })();
    mockJS.FunctionProxy = FunctionProxy;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=FunctionProxy.js.map
