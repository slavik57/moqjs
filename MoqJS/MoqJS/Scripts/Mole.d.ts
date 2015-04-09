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
