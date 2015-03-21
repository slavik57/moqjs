'use strict';

module moqJS {
    export interface IFunctionCallMode {
    }

    export class InvokeFunctionCallMode implements IFunctionCallMode {
    }

    export class VerifyFunctionCallMode implements IFunctionCallMode {
        public numberOfMatches: number;

        constructor() {
            this.numberOfMatches = 0;
        }
    }

    export class OverrideFunctionCallMode implements IFunctionCallMode {
        constructor(public override: (...args: any[]) => any) {
        }
    }

    export class ReturnsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        constructor(public getReturnValue: (...args: any[]) => any) {
            super(getReturnValue);
        }
    }

    export class ThrowsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        constructor(public getErrorToThrow: (...args: any[]) => any) {
            super(getErrorToThrow);
        }
    }

    export class CallbackOverrideFunctionCallMode extends OverrideFunctionCallMode {
        constructor(public callbackFunction: (...args: any[]) => void) {
            super(callbackFunction);
        }
    }
}