'use strict';

module moqJS {
    // TODO: Implement:
    //  Mock wrapping mole
    //  if has no setup should throw exception = strict
    //  setup get
    //  setup set
    // Get the mock by the object instace...
    // from all the created mocks get the one that behaves like this:( mock => boolean )
    export class Mole<T> {
        private _FunctionProxyConfigurations: FunctionProxyConfigurations;

        constructor(public object: T) {
            this._FunctionProxyConfigurations = new FunctionProxyConfigurations();
            this._FunctionProxyConfigurations.callBase = true;

            this._setFunctionProxies();
        }

        public get callBase() {
            return this._FunctionProxyConfigurations.callBase;
        }

        public set callBase(value: boolean) {
            this._FunctionProxyConfigurations.callBase = value;
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
            var proxies: FunctionProxy[] = [];

            for (var propertyName in this.object) {
                var propertyValue = this.object[propertyName];

                if (typeof (propertyValue) != "function") {
                    continue;
                }

                var functionProxy = new FunctionProxy(propertyValue, this.object, this._FunctionProxyConfigurations);
                proxies.push(functionProxy);

                this._setFunctionProxy(proxies, proxies.length - 1, propertyName);
            }
        }

        private _setFunctionProxy(proxies: FunctionProxy[], proxyNumber: number, functionName: string) {
            this.object[functionName] = (...args: any[]) => proxies[proxyNumber].callFunction(args);
        }
    }
}