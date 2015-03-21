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
            var functionOverride = new FunctionOverride((...args: any[]) => {
                return returnFunction.apply(this.object, args);
            }, FunctionOverrideType.LazyReturns);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }

        public returns(value: any) {
            var functionOverride = new FunctionOverride(() => {
                return value;
            }, FunctionOverrideType.Returns);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }

        public callback(callback: (...args: any[]) => void) {
            var functionOverride = new FunctionOverride((...args: any[]) => {
                callback.apply(this.object, args);
            }, FunctionOverrideType.Callback);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }

        public throws(error: any) {
            var functionOverride = new FunctionOverride(() => {
                throw error;
            }, FunctionOverrideType.Throws);

            this.functionProxyConfigurations.functionOverride = functionOverride;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionOverride = null;
        }
    }
}