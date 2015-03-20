'use strict';

module moqJS {
    export class FunctionProxy {
        private _numberOfTimesCalled: number;
        private _actualArguments: Array<any[]>;

        constructor(public functionToWrap: Function,
            public thisObject: any,
            public functionProxyConfigurations: FunctionProxyConfigurations) {

            this._numberOfTimesCalled = 0;
            this._actualArguments = [];
        }

        public callFunction(args: any[]) {
            if (!this.functionProxyConfigurations.isVerifying) {
                this._callFunctionWithoutVerification(args);
            } else {
                this._verifyFunction(args);
            }
        }

        private _callFunctionWithoutVerification(args: any[]) {
            this._numberOfTimesCalled++;
            this._actualArguments.push(args);

            this.functionToWrap.apply(this.thisObject, args);
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