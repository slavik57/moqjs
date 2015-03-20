'use strict';

module mockJS {
    export class FunctionProxy {
        private _numberOfTimesCalled: number;
        private _argumentsOfCalls: Array<any[]>;

        constructor(public functionToWrap: Function,
            public thisObject: any,
            public functionProxyConfigurations: FunctionProxyConfigurations) {

            this._numberOfTimesCalled = 0;
            this._argumentsOfCalls = [];
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
            this._argumentsOfCalls.push(args);

            this.functionToWrap.apply(this.thisObject, args);
        }

        private _verifyFunction(args: any[]) {
            for (var i = 0; i < this._argumentsOfCalls.length; i++) {
                var argumentOfCall = this._argumentsOfCalls[i];

                if (this._doArgumentsMatch(args, argumentOfCall)) {
                    this.functionProxyConfigurations.hasMatch = true;
                    return;
                }
            }
        }

        private _doArgumentsMatch(args: any[], argumentsOfCall: any[]) {
            if (args.length !== argumentsOfCall.length) {
                return false;
            }

            if (args.length === 0) {
                return true;
            }

            for (var i = 0; i < args.length; i++) {
                if (args[i] !== argumentsOfCall[i]) {
                    return false;
                }
            }

            return true;
        }
    }
}