'use strict';
var moqJS;
(function (moqJS) {
    // TODO: Tests
    var FunctionSetup = (function () {
        function FunctionSetup(functionCall, functionProxyConfigurations) {
            this.functionCall = functionCall;
            this.functionProxyConfigurations = functionProxyConfigurations;
        }
        FunctionSetup.prototype.returns = function (value) {
            // TODO: implement
        };

        FunctionSetup.prototype.callback = function (callback) {
            // TODO: implement
        };

        FunctionSetup.prototype.throws = function (error) {
            // TODO: implement
        };
        return FunctionSetup;
    })();
    moqJS.FunctionSetup = FunctionSetup;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionSetup.js.map
