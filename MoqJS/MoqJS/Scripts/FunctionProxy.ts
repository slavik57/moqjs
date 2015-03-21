'use strict';

module moqJS {
    export class FunctionProxy {
        private _numberOfTimesCalled: number;
        private _actualArguments: Array<any[]>;

        constructor(public originalFunction: Function,
            public thisObject: any,
            public functionProxyConfigurations: FunctionProxyConfigurations) {

            this._numberOfTimesCalled = 0;
            this._actualArguments = [];
        }

        public callFunction(args: any[]): any {
            if (!this.functionProxyConfigurations.isVerifying) {
                return this._callFunctionWithoutVerification(args);
            } else if (this.functionProxyConfigurations.functionOverride) {
                // TODO: add overrides
            } else {
                this._verifyFunction(args);
            }
        }

        private _callFunctionWithoutVerification(args: any[]): any {
            // TODO: if has overrides execute each override one by one

            this._numberOfTimesCalled++;
            this._actualArguments.push(args);

            if (this.functionProxyConfigurations.callBase) {
                return this.originalFunction.apply(this.thisObject, args);
            }
        }

        private _verifyFunction(expectedArguments: any[]) {
            for (var i = 0; i < this._actualArguments.length; i++) {
                var actualArguments = this._actualArguments[i];

                if (this._doArgumentsMatch(expectedArguments, actualArguments)) {
                    this.functionProxyConfigurations.numberOfMatches++;
                }
            }
        }

        private _doArgumentsMatch(expectedArguments: any[], actualArguments: any[]) {
            if (expectedArguments.length !== actualArguments.length) {
                return false;
            }

            if (expectedArguments.length === 0) {
                return true;
            }

            for (var i = 0; i < expectedArguments.length; i++) {
                if (!this._isSameArgument(actualArguments[i], expectedArguments[i])) {
                    return false;
                }
            }

            return true;
        }

        private _isSameArgument(actual: any, expected: any) {
            var itIsItIsBase: ItIsBase = It.isAny(ItIsBase);

            if (!itIsItIsBase.match(expected)) {
                return actual === expected;
            }

            var expectedItIsBase: ItIsBase = expected;

            return expectedItIsBase.match(actual);
        }
    }
}