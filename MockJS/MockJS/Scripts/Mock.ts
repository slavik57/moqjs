﻿'use strict';

module mockJS {
    export class Mock<T> {
        private _FunctionProxyConfigurations: FunctionProxyConfigurations;

        constructor(public object: T) {
            this._FunctionProxyConfigurations = new FunctionProxyConfigurations();

            this._setFunctionProxies();
        }

        public verify(functionCall: (object: T) => any, times?: ITimes): boolean {
            this._FunctionProxyConfigurations.isVerifying = true;
            this._FunctionProxyConfigurations.numberOfMatches = 0;

            functionCall(this.object);

            var numberOfMatches: number = this._FunctionProxyConfigurations.numberOfMatches;

            this._FunctionProxyConfigurations.isVerifying = false;
            this._FunctionProxyConfigurations.numberOfMatches = 0;

            if (!times) {
                return numberOfMatches > 0;
            }

            return times.match(numberOfMatches);
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
                //this.object[propertyName] = (...args: any[]) => {
                //    functionProxy.callFunction(args);
                //}
            }
        }

        private _setFunctionProxy(proxies: FunctionProxy[], proxyNumber: number, functionName: string) {
            this.object[functionName] = (...args: any[]) => proxies[proxyNumber].callFunction(args);
        }
    }
}