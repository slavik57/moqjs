'use strict';

module mockJS {
    export class Mock<T> {
        private _FunctionProxyConfigurations: FunctionProxyConfigurations;

        constructor(public object: T) {
            this._FunctionProxyConfigurations = new FunctionProxyConfigurations();

            this._setFunctionProxies();
        }

        public Verify(functionCall: (object: T) => any): boolean {
            this._FunctionProxyConfigurations.isVerifying = true;
            this._FunctionProxyConfigurations.hasMatch = false;

            functionCall(this.object);

            var hasMatch = this._FunctionProxyConfigurations.hasMatch;

            this._FunctionProxyConfigurations.isVerifying = false;
            this._FunctionProxyConfigurations.hasMatch = false;

            return hasMatch;
        }

        private _setFunctionProxies() {
            for (var propertyName in this.object) {
                var propertyValue = this.object[propertyName];

                if (typeof (propertyValue) != "function") {
                    continue;
                }

                var functionProxy = new FunctionProxy(propertyValue, this.object, this._FunctionProxyConfigurations);
                this.object[propertyName] = (...args: any[]) => functionProxy.callFunction(args);
            }
        }
    }
}