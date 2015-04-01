'use strict';

module moqJS {
    // TODO: Implement:
    //  Mock wrapping mole
    //  setup get
    //  setup set
    // Get the mock by the object instace...
    // from all the created mocks get the one that behaves like this:( mock => boolean )
    export class Mole<T> {
        private _proxies: FunctionProxy[];
        private _FunctionProxyConfigurations: FunctionProxyConfigurations;

        constructor(public object: T) {
            this._FunctionProxyConfigurations = new FunctionProxyConfigurations();
            this._FunctionProxyConfigurations.callBase = true;

            this._setFunctionProxies();
        }

        public dispose() {
            for (var i = 0; i < this._proxies.length; i++) {
                var proxy: FunctionProxy = this._proxies[i];

                this.object[proxy.originalFunctionName] = proxy.originalFunction;
            }
        }

        public get callBase() {
            return this._FunctionProxyConfigurations.callBase;
        }

        public set callBase(value: boolean) {
            this._FunctionProxyConfigurations.callBase = value;
        }

        public get isStrict() {
            return this._FunctionProxyConfigurations.isStrict;
        }

        public set isStrict(value: boolean) {
            this._FunctionProxyConfigurations.isStrict = value;
        }

        public setup(functionCall: (object: T) => any): IFunctionSetup {
            return new FunctionSetup(functionCall, this.object, this._FunctionProxyConfigurations);
        }

        public setupPrivate(privateFunctionName: string, ...functionArguments: any[]): IFunctionSetup {
            var functionCall = (object: T) => {
                var privateFunction: Function = object[privateFunctionName];
                privateFunction.apply(object, functionArguments);
            };

            return this.setup(functionCall);
        }

        public verify(functionCall: (object: T) => any, times?: ITimes): boolean {
            var verifyMode = new VerifyFunctionCallMode();
            this._FunctionProxyConfigurations.functionCallMode = verifyMode;

            functionCall(this.object);


            this._FunctionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

            var numberOfMatches: number = verifyMode.numberOfMatches;
            if (!times) {
                return numberOfMatches > 0;
            }

            return times.match(numberOfMatches);
        }

        public verifyPrivate(privateFunctionName: string, functionArguments: any[], times?: ITimes): boolean {
            var functionCall = (object: T) => {
                var privateFunction: Function = object[privateFunctionName];
                privateFunction.apply(object, functionArguments);
            };

            return this.verify(functionCall, times);
        }

        private _setFunctionProxies() {
            this._proxies = [];

            var propertyNames: string[] = this._getObjectPropertyNames();

            for (var i = 0; i < propertyNames.length; i++) {
                try {
                    var propertyName = propertyNames[i];
                    var propertyValue = this.object[propertyName];

                    if (typeof (propertyValue) != "function") {
                        continue;
                    }

                    var functionProxy = new FunctionProxy(propertyName, propertyValue, this.object, this._FunctionProxyConfigurations);
                    this._proxies.push(functionProxy);

                    this._setFunctionProxy(this._proxies, this._proxies.length - 1, propertyName);
                } catch(e) {
                }
            }
        }

        private _getObjectPropertyNames() {
            var propertyNames: string[] = Object.getOwnPropertyNames(this.object);
            for (var propertyName in this.object) {
                if (propertyNames.lastIndexOf(propertyName) < 0) {
                    propertyNames.push(propertyName);
                }
            }

            return propertyNames;
        }

        private _setFunctionProxy(proxies: FunctionProxy[], proxyNumber: number, functionName: string) {
            this.object[functionName] = (...args: any[]) => proxies[proxyNumber].callFunction(args);
        }
    }
}