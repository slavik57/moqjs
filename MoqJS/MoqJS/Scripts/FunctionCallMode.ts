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
        constructor(public override: (...args: any[]) => any, public overrideType: FunctionOverrideType) {
        }
    }
}