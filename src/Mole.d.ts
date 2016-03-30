import { IFunctionSetup } from './functionSetup/IFunctionSetup';
import { ITimes } from './times/ITimes';
export declare class Mole<T> {
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
