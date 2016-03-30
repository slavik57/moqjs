"use strict";
(function (FunctionExecutionResult) {
    FunctionExecutionResult[FunctionExecutionResult["ThrowError"] = 0] = "ThrowError";
    FunctionExecutionResult[FunctionExecutionResult["ReturnValue"] = 1] = "ReturnValue";
    FunctionExecutionResult[FunctionExecutionResult["DoNothing"] = 2] = "DoNothing";
})(exports.FunctionExecutionResult || (exports.FunctionExecutionResult = {}));
var FunctionExecutionResult = exports.FunctionExecutionResult;
