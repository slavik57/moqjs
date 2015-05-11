declare module moqJS {
    interface IFunctionCallMode {
    }
    class InvokeFunctionCallMode implements IFunctionCallMode {
    }
    class VerifyFunctionCallMode implements IFunctionCallMode {
        numberOfMatches: number;
        constructor();
    }
    class OverrideFunctionCallMode implements IFunctionCallMode {
        override: (...args: any[]) => any;
        constructor(override: (...args: any[]) => any);
    }
    class ReturnsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        getReturnValue: (...args: any[]) => any;
        constructor(getReturnValue: (...args: any[]) => any);
    }
    class ThrowsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        getErrorToThrow: (...args: any[]) => any;
        constructor(getErrorToThrow: (...args: any[]) => any);
    }
    class CallbackOverrideFunctionCallMode extends OverrideFunctionCallMode {
        callbackFunction: (...args: any[]) => void;
        constructor(callbackFunction: (...args: any[]) => void);
    }
}
declare module moqJS {
    class FunctionProxy {
        originalFunctionName: string;
        originalFunction: Function;
        thisObject: any;
        functionProxyConfigurations: FunctionProxyConfigurations;
        private _numberOfTimesCalled;
        private _actualArguments;
        private _argumentsWithOverridesList;
        constructor(originalFunctionName: string, originalFunction: Function, thisObject: any, functionProxyConfigurations: FunctionProxyConfigurations);
        callFunction(args: any[]): any;
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
        callBase: boolean;
        isStrict: boolean;
        moleReturnValue: boolean;
        functionCallMode: IFunctionCallMode;
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
        functionCall: (object: T) => any;
        object: T;
        functionProxyConfigurations: FunctionProxyConfigurations;
        constructor(functionCall: (object: T) => any, object: T, functionProxyConfigurations: FunctionProxyConfigurations);
        lazyReturns(returnFunction: Function): IFunctionSetup;
        lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup;
        returns(value: any): IFunctionSetup;
        returnsInOrder(values: any[]): IFunctionSetup;
        callback(callback: Function): IFunctionSetup;
        lazyThrows(errorReturningFunction: Function): IFunctionSetup;
        throws(error: any): IFunctionSetup;
        private _callWithOverrideMode(overrideMode);
    }
}
declare module moqJS {
    class ItIsBase {
        match(argument: any): boolean;
    }
    class It {
        static isAny(type: Function): any;
        static is<T>(predicate: (argument: T) => boolean): any;
        static isInRange(minimumValue: number, maximumValue: number): any;
        static isRegExp(regExp: RegExp): any;
    }
}
declare module moqJS {
    class Mole<T> {
        object: T;
        private static _moles;
        private _functionProxies;
        private _propertyGetterProxies;
        private _propertySetterProxies;
        private _FunctionProxyConfigurations;
        constructor(object: T);
        dispose(): void;
        callBase: boolean;
        isStrict: boolean;
        moleReturnValue: boolean;
        setup(functionCall: (object: T) => any): IFunctionSetup;
        setupPrivate(privatePropertyName: string, ...functionArguments: any[]): IFunctionSetup;
        verify(functionCall: (object: T) => any, times?: ITimes): boolean;
        verifyPrivate(privateFunctionName: string, functionArguments: any[], times?: ITimes): boolean;
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
