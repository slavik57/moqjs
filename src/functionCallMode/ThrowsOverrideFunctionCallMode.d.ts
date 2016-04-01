import { OverrideFunctionCallMode } from './OverrideFunctionCallMode';
export declare class ThrowsOverrideFunctionCallMode extends OverrideFunctionCallMode {
    getErrorToThrow: (...args: any[]) => any;
    constructor(getErrorToThrow: (...args: any[]) => any);
}
