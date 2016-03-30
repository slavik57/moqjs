import { IFunctionSetup } from './IFunctionSetup';
import { FunctionProxyConfigurations } from '../functionProxy/FunctionProxyConfigurations';
export declare class FunctionSetup<T> implements IFunctionSetup {
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
