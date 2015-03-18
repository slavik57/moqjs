'use strict';
var mockJS;
(function (mockJS) {
    var FunctionProxyConfigurations = (function () {
        function FunctionProxyConfigurations() {
            this.isVerifying = false;
            this.hasMatch = false;
        }
        return FunctionProxyConfigurations;
    })();
    mockJS.FunctionProxyConfigurations = FunctionProxyConfigurations;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=FunctionProxyConfigurations.js.map
