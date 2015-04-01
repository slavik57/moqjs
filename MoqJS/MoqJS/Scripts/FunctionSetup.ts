'use strict';

module moqJS {
    export interface IFunctionSetup {
        lazyReturns(returnFunction: Function): IFunctionSetup;
        lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup;
        returns(value: any): IFunctionSetup;
        returnsInOrder(values: any[]): IFunctionSetup;
        callback(callback: Function): IFunctionSetup;
        throws(error: any): IFunctionSetup;
    }

    export class FunctionSetup<T> implements IFunctionSetup {
        constructor(public functionCall: (object: T) => any, public object: T, public functionProxyConfigurations: FunctionProxyConfigurations) {
        }

        // TODO: add lazyThrows

        public lazyReturns(returnFunction: Function): IFunctionSetup {
            var overrideMode = new ReturnsOverrideFunctionCallMode((...args: any[]) => {
                return returnFunction.apply(this.object, args);
            });

            this.functionProxyConfigurations.functionCallMode = overrideMode;

            this.functionCall(this.object);

            this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

            return this;
        }

        public lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup {
            // NOTE: Clone to keep all given values and not change the orinial array
            var functions = returnFunctions.map(func => func);

            var overrideMode = new ReturnsOverrideFunctionCallMode((...args: any[]) => {
                if (functions.length < 1) {
                    return undefined;
                }

                var firstFunction = functions.shift();

                return firstFunction.apply(this.object, args);
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

        public returnsInOrder(values: any[]): IFunctionSetup {
            var itemsToReturnFunctions = values.map(value => {
                return () => value;
                });

            return this.lazyReturnsInOrder(itemsToReturnFunctions);
        }

        public callback(callback: Function): IFunctionSetup {
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