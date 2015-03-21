'use strict';
var moqJS;
(function (moqJS) {
    var InvokeFunctionCallMode = (function () {
        function InvokeFunctionCallMode() {
        }
        return InvokeFunctionCallMode;
    })();
    moqJS.InvokeFunctionCallMode = InvokeFunctionCallMode;

    var VerifyFunctionCallMode = (function () {
        function VerifyFunctionCallMode() {
            this.numberOfMatches = 0;
        }
        return VerifyFunctionCallMode;
    })();
    moqJS.VerifyFunctionCallMode = VerifyFunctionCallMode;

    var OverrideFunctionCallMode = (function () {
        function OverrideFunctionCallMode(override, overrideType) {
            this.override = override;
            this.overrideType = overrideType;
        }
        return OverrideFunctionCallMode;
    })();
    moqJS.OverrideFunctionCallMode = OverrideFunctionCallMode;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionCallMode.js.map
