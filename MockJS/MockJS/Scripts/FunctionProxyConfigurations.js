'use strict';
var mockJS;
(function (mockJS) {
    var FunctionProxyConfigurations = (function () {
        function FunctionProxyConfigurations() {
            this.isVerifying = false;
            this.numberOfMatches = 0;
        }
        return FunctionProxyConfigurations;
    })();
    mockJS.FunctionProxyConfigurations = FunctionProxyConfigurations;
})(mockJS || (mockJS = {}));
//# sourceMappingURL=FunctionProxyConfigurations.js.map
