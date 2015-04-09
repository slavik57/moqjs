declare module moqJS {
    interface IFunctionSetup {
        lazyReturns(returnFunction: Function): IFunctionSetup;
        lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup;
        returns(value: any): IFunctionSetup;
        returnsInOrder(values: any[]): IFunctionSetup;
        callback(callback: Function): IFunctionSetup;
        lazyThrows(errorReturningFunction: Function): IFunctionSetup;
        throws(error: any): IFunctionSetup;
    }
    class FunctionSetup<T> implements IFunctionSetup {
        public functionCall: (object: T) => any;
        public object: T;
        public functionProxyConfigurations: FunctionProxyConfigurations;
        constructor(functionCall: (object: T) => any, object: T, functionProxyConfigurations: FunctionProxyConfigurations);
        public lazyReturns(returnFunction: Function): IFunctionSetup;
        public lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup;
        public returns(value: any): IFunctionSetup;
        public returnsInOrder(values: any[]): IFunctionSetup;
        public callback(callback: Function): IFunctionSetup;
        public lazyThrows(errorReturningFunction: Function): IFunctionSetup;
        public throws(error: any): IFunctionSetup;
        private _callWithOverrideMode(overrideMode);
    }
}
