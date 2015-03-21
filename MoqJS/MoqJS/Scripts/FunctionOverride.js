'use strict';
var moqJS;
(function (moqJS) {
    (function (FunctionOverrideType) {
        FunctionOverrideType[FunctionOverrideType["Returns"] = 0] = "Returns";
        FunctionOverrideType[FunctionOverrideType["ReturnsLazy"] = 1] = "ReturnsLazy";
        FunctionOverrideType[FunctionOverrideType["Throws"] = 2] = "Throws";
        FunctionOverrideType[FunctionOverrideType["Callback"] = 3] = "Callback";
    })(moqJS.FunctionOverrideType || (moqJS.FunctionOverrideType = {}));
    var FunctionOverrideType = moqJS.FunctionOverrideType;
    ;

    var FunctionOverride = (function () {
        function FunctionOverride(override, overrideType) {
            this.override = override;
            this.overrideType = overrideType;
        }
        return FunctionOverride;
    })();
    moqJS.FunctionOverride = FunctionOverride;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionOverride.js.map
