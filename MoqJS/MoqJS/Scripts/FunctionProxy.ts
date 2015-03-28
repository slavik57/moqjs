'use strict';

module moqJS {
    class ArgumentsWithOverrides {
        constructor(public exptectedArguments: any[], public override: OverrideFunctionCallMode) {
        }
    }

    enum FunctionExecutionResult {
        ThrowError,
        ReturnValue,
        DoNothing
    }

    export class FunctionProxy {
        private _numberOfTimesCalled: number;
        private _actualArguments: Array<any[]>;

        private _argumentsWithOverridesList: ArgumentsWithOverrides[];

        constructor(public originalFunctionName: string,
            public originalFunction: Function,
            public thisObject: any,
            public functionProxyConfigurations: FunctionProxyConfigurations) {

            this._numberOfTimesCalled = 0;
            this._actualArguments = [];
            this._argumentsWithOverridesList = [];
        }

        public callFunction(args: any[]): any {
            if (this.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode) {
                return this._callFunctionWithoutVerification(args);
            } else if (this.functionProxyConfigurations.functionCallMode instanceof OverrideFunctionCallMode) {
                this._addOverride(args, <OverrideFunctionCallMode>this.functionProxyConfigurations.functionCallMode);
            } else if (this.functionProxyConfigurations.functionCallMode instanceof VerifyFunctionCallMode) {
                this._verifyFunction(args, <VerifyFunctionCallMode>this.functionProxyConfigurations.functionCallMode);
            } else {
                throw 'not supported functionCallMode';
            }
        }

        private _callFunctionWithoutVerification(actualArguments: any[]): any {
            this._numberOfTimesCalled++;
            this._actualArguments.push(actualArguments);

            var matchingOverrides: OverrideFunctionCallMode[] = this._getMatchingOverrides(actualArguments);
            if (matchingOverrides.length > 0) {
                return this._executeOverrides(matchingOverrides, actualArguments);
            }

            if (this.functionProxyConfigurations.isStrict) {
                throw 'No function setups defined and using strict mode. Change "isStrict" to false or define a function setup';
            }

            if (this.functionProxyConfigurations.callBase) {
                return this.originalFunction.apply(this.thisObject, actualArguments);
            }
        }

        private _getMatchingOverrides(actualArguments: any[]): OverrideFunctionCallMode[]{
            var result: OverrideFunctionCallMode[] = [];

            for (var i = 0; i < this._argumentsWithOverridesList.length; i++) {
                var argumentsWithOverrides = this._argumentsWithOverridesList[i];

                if (this._doArgumentsMatch(argumentsWithOverrides.exptectedArguments, actualArguments)) {
                    result.push(argumentsWithOverrides.override);
                }
            }

            return result;
        }

        private _executeOverrides(overrides: OverrideFunctionCallMode[], args: any[]) {
            var functionExecutionResult = FunctionExecutionResult.DoNothing;

            var lastError;
            var lastResult;

            for (var i = 0; i < overrides.length; i++) {
                var override = overrides[i];

                if (override instanceof ThrowsOverrideFunctionCallMode) {
                    functionExecutionResult = FunctionExecutionResult.ThrowError;
                    lastError = override.override.apply(this.thisObject, args);
                    continue;
                }

                if (override instanceof ReturnsOverrideFunctionCallMode) {
                    functionExecutionResult = FunctionExecutionResult.ReturnValue;
                    lastResult = override.override.apply(this.thisObject, args);
                    continue;
                }

                if (override instanceof CallbackOverrideFunctionCallMode) {
                    override.override.apply(this.thisObject, args);
                    continue;
                }
            }

            switch (functionExecutionResult) {
                case FunctionExecutionResult.ReturnValue:
                    return lastResult;
                case FunctionExecutionResult.ThrowError:
                    throw lastError;
            }
        }

        private _verifyFunction(expectedArguments: any[], verifyFunctionCallMode: VerifyFunctionCallMode) {
            for (var i = 0; i < this._actualArguments.length; i++) {
                var actualArguments = this._actualArguments[i];

                if (this._doArgumentsMatch(expectedArguments, actualArguments)) {
                    verifyFunctionCallMode.numberOfMatches++;
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

        private _addOverride(expectedArguments: any[], overrideMode: OverrideFunctionCallMode) {
            var argumentsWithOverrides =
                new ArgumentsWithOverrides(expectedArguments, overrideMode);

            this._argumentsWithOverridesList.push(argumentsWithOverrides);
        }
    }
}