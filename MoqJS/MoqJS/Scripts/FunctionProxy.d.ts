declare module moqJS {
    class FunctionProxy {
        public originalFunctionName: string;
        public originalFunction: Function;
        public thisObject: any;
        public functionProxyConfigurations: FunctionProxyConfigurations;
        private _numberOfTimesCalled;
        private _actualArguments;
        private _argumentsWithOverridesList;
        constructor(originalFunctionName: string, originalFunction: Function, thisObject: any, functionProxyConfigurations: FunctionProxyConfigurations);
        public callFunction(args: any[]): any;
        private _callFunctionWithoutVerification(actualArguments);
        private _getMatchingOverrides(actualArguments);
        private _executeOverrides(overrides, args);
        private _verifyFunction(expectedArguments, verifyFunctionCallMode);
        private _doArgumentsMatch(expectedArguments, actualArguments);
        private _isSameArgument(actual, expected);
        private _addOverride(expectedArguments, overrideMode);
        private _moleReturnValueIfNeeded<T>(returnValue);
    }
}
