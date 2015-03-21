'use strict';

module moqJS {
    export interface IFunctionSetup<T> {
        returns(value: any);
        callback(callback: (...args: any[]) => any);
        throws(error: any);
    }

    // TODO: Tests
    export class FunctionSetup<T> implements IFunctionSetup<T> {
        constructor(public functionCall: (object: T) => any, public functionProxyConfigurations: FunctionProxyConfigurations) {
        }

        public returns(value: any) {
            // TODO: implement
        }

        public callback(callback: (...args: any[]) => any) {
            // TODO: implement
        }

        public throws(error: any) {
            // TODO: implement
        }
    }
}