declare module moqJS {
    interface IFunctionCallMode {
    }
    class InvokeFunctionCallMode implements IFunctionCallMode {
    }
    class VerifyFunctionCallMode implements IFunctionCallMode {
        public numberOfMatches: number;
        constructor();
    }
    class OverrideFunctionCallMode implements IFunctionCallMode {
        public override: (...args: any[]) => any;
        constructor(override: (...args: any[]) => any);
    }
    class ReturnsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        public getReturnValue: (...args: any[]) => any;
        constructor(getReturnValue: (...args: any[]) => any);
    }
    class ThrowsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        public getErrorToThrow: (...args: any[]) => any;
        constructor(getErrorToThrow: (...args: any[]) => any);
    }
    class CallbackOverrideFunctionCallMode extends OverrideFunctionCallMode {
        public callbackFunction: (...args: any[]) => void;
        constructor(callbackFunction: (...args: any[]) => void);
    }
}
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
declare module moqJS {
    class FunctionProxyConfigurations {
        public callBase: boolean;
        public isStrict: boolean;
        public moleReturnValue: boolean;
        public functionCallMode: IFunctionCallMode;
        constructor();
    }
}
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
declare module moqJS {
    class ItIsBase {
        public match(argument: any): boolean;
    }
    class It {
        static isAny(type: Function): ItIsBase;
        static is<T>(predicate: (argument: T) => boolean): ItIsBase;
        static isInRange(minimumValue: number, maximumValue: number): ItIsBase;
        static isRegExp(regExp: RegExp): ItIsBase;
    }
}
declare module moqJS {
    class Mole<T> {
        public object: T;
        private static _moles;
        private _functionProxies;
        private _propertyGetterProxies;
        private _propertySetterProxies;
        private _FunctionProxyConfigurations;
        constructor(object: T);
        public dispose(): void;
        public callBase : boolean;
        public isStrict : boolean;
        public moleReturnValue : boolean;
        public setup(functionCall: (object: T) => any): IFunctionSetup;
        public setupPrivate(privatePropertyName: string, ...functionArguments: any[]): IFunctionSetup;
        public verify(functionCall: (object: T) => any, times?: ITimes): boolean;
        public verifyPrivate(privateFunctionName: string, functionArguments: any[], times?: ITimes): boolean;
        static findMoleByObject<T>(object: T): Mole<T>;
        private _setFunctionProxies();
        private _getObjectPropertyNames();
        private _setFunctionProxy(proxies, proxyNumber, functionName);
        private _setPropertiesProxies();
        private _getPropertyDescriptor(obj, propertyName);
        private _setProperty(obj, propertyName, propertyDescriptor);
        private _setPropertyGetterProxy(propertyName, descriptor);
        private _setPropertySetterProxy(propertyName, descriptor);
    }
}
declare module moqJS {
    interface ITimes {
        match(actual: number): boolean;
    }
    class Times {
        static lessThan(expected: number): ITimes;
        static atMost(expected: number): ITimes;
        static exact(expected: number): ITimes;
        static atLeast(expected: number): ITimes;
        static moreThan(expected: number): ITimes;
        static between(minimum: number, maximum: number): ITimes;
    }
}
