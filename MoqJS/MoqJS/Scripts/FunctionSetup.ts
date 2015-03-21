'use strict';

module moqJS {
    export interface IFunctionSetup {
        returns(value: any);
        callback(callback: (...args: any[]) => any);
        throws(error: any);
    }

    // TODO: support chaining => returns().callback().throws().....
    export class FunctionSetup<T> implements IFunctionSetup {
        constructor(public functionCall: (object: T) => any, public object: T, public functionProxyConfigurations: FunctionProxyConfigurations) {
        }

        public lazyReturns(returnFunction: (...args: any[]) => any) {
            var overrideMode = new OverrideFunctionCallMode((...args: any[]) => {
                return returnFunction.apply(this.object, args);
            }, FunctionOverrideType.LazyReturns);

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }

        public returns(value: any) {
            var overrideMode = new OverrideFunctionCallMode(() => {
                return value;
            }, FunctionOverrideType.Returns);

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }

        public callback(callback: (...args: any[]) => void) {
            var overrideMode = new OverrideFunctionCallMode((...args: any[]) => {
                callback.apply(this.object, args);
            }, FunctionOverrideType.Callback);

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }

        public throws(error: any) {
            var overrideMode = new OverrideFunctionCallMode(() => {
                throw error;
            }, FunctionOverrideType.Throws);

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }
    }
}