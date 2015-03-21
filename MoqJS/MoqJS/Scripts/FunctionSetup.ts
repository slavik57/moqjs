'use strict';

module moqJS {
    export interface IFunctionSetup {
        returns(value: any);
        callback(callback: (...args: any[]) => any);
        throws(error: any);
    }

    export class FunctionSetup<T> implements IFunctionSetup {
        constructor(public functionCall: (object: T) => any, public object: T, public functionProxyConfigurations: FunctionProxyConfigurations) {
        }

        public lazyReturns(returnFunction: (...args: any[]) => any) {
            // TODO: implement
        }

        public returns(value: any) {
            this.functionProxyConfigurations.functionOverride = () => {
                return value;
            };

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }

        public callback(callback: (...args: any[]) => void) {
            this.functionProxyConfigurations.functionOverride = (...args: any[]) => {
                callback.apply(this.object, args);
            }

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }

        public throws(error: any) {
            this.functionProxyConfigurations.functionOverride = () => {
                throw error;
            };

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }
    }
}