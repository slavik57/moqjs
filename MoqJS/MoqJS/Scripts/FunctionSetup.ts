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

        // TODO: add returnsInOrder and lazyReturnsInOrder....
        //  given list of return values return every call the next value... when finished return undefined
        // TODO: add lazyThrows

        public lazyReturns(returnFunction: (...args: any[]) => any) {
            var overrideMode = new ReturnsOverrideFunctionCallMode((...args: any[]) => {
                return returnFunction.apply(this.object, args);
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }

        public returns(value: any) {
            var overrideMode = new ReturnsOverrideFunctionCallMode(() => {
                return value;
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }

        public callback(callback: (...args: any[]) => void) {
            var overrideMode = new CallbackOverrideFunctionCallMode((...args: any[]) => {
                callback.apply(this.object, args);
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }

        public throws(error: any) {
            var overrideMode = new ThrowsOverrideFunctionCallMode(() => {
                return error;
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();
        }
    }
}