'use strict';

module moqJS {
    export enum FunctionOverrideType {
        Returns,
        LazyReturns,
        Throws,
        Callback
    };

    export class FunctionOverride {
        constructor(public override: (...args: any[]) => any, public overrideType: FunctionOverrideType) {
        }
    }
} 