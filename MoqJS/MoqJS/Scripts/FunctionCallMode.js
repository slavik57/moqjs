'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        function OverrideFunctionCallMode(override) {
            this.override = override;
        }
        return OverrideFunctionCallMode;
    })();
    moqJS.OverrideFunctionCallMode = OverrideFunctionCallMode;

    var ReturnsOverrideFunctionCallMode = (function (_super) {
        __extends(ReturnsOverrideFunctionCallMode, _super);
        function ReturnsOverrideFunctionCallMode(getReturnValue) {
            _super.call(this, getReturnValue);
            this.getReturnValue = getReturnValue;
        }
        return ReturnsOverrideFunctionCallMode;
    })(OverrideFunctionCallMode);
    moqJS.ReturnsOverrideFunctionCallMode = ReturnsOverrideFunctionCallMode;

    var ThrowsOverrideFunctionCallMode = (function (_super) {
        __extends(ThrowsOverrideFunctionCallMode, _super);
        function ThrowsOverrideFunctionCallMode(getErrorToThrow) {
            _super.call(this, getErrorToThrow);
            this.getErrorToThrow = getErrorToThrow;
        }
        return ThrowsOverrideFunctionCallMode;
    })(OverrideFunctionCallMode);
    moqJS.ThrowsOverrideFunctionCallMode = ThrowsOverrideFunctionCallMode;

    var CallbackOverrideFunctionCallMode = (function (_super) {
        __extends(CallbackOverrideFunctionCallMode, _super);
        function CallbackOverrideFunctionCallMode(callbackFunction) {
            _super.call(this, callbackFunction);
            this.callbackFunction = callbackFunction;
        }
        return CallbackOverrideFunctionCallMode;
    })(OverrideFunctionCallMode);
    moqJS.CallbackOverrideFunctionCallMode = CallbackOverrideFunctionCallMode;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=FunctionCallMode.js.map
