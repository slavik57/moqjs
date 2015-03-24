'use strict';

module moqJS {
    export interface IFunctionSetup {
        lazyReturns(returnFunction: (...args: any[]) => any): IFunctionSetup;
        returns(value: any): IFunctionSetup;
        callback(callback: (...args: any[]) => any): IFunctionSetup;
        throws(error: any): IFunctionSetup;
    }

    export class FunctionSetup<T> implements IFunctionSetup {
        constructor(public functionCall: (object: T) => any, public object: T, public functionProxyConfigurations: FunctionProxyConfigurations) {
        }

        // TODO: add returnsInOrder and lazyReturnsInOrder....
        //  given list of return values return every call the next value... when finished return undefined
        // TODO: add lazyThrows

        public lazyReturns(returnFunction: (...args: any[]) => any): IFunctionSetup {
            var overrideMode = new ReturnsOverrideFunctionCallMode((...args: any[]) => {
                return returnFunction.apply(this.object, args);
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

            return this;
        }

        public returns(value: any): IFunctionSetup {
            var overrideMode = new ReturnsOverrideFunctionCallMode(() => {
                return value;
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

            return this;
        }

        public callback(callback: (...args: any[]) => void): IFunctionSetup {
            var overrideMode = new CallbackOverrideFunctionCallMode((...args: any[]) => {
                callback.apply(this.object, args);
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

            return this;
        }

        public throws(error: any): IFunctionSetup {
            var overrideMode = new ThrowsOverrideFunctionCallMode(() => {
                return error;
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

            return this;
        }
    }
}