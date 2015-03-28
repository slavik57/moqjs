'use strict';
var moqJS;
(function (moqJS) {
    var FunctionProxyConfigurations = (function () {
        function FunctionProxyConfigurations() {
            this.callBase = true;
            this.isStrict = false;
            this.functionCallMode = new moqJS.InvokeFunctionCallMode();
        }
        return FunctionProxyConfigurations;
    })();
    moqJS.FunctionProxyConfigurations = FunctionProxyConfigurations;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionProxyConfigurations.js.map
