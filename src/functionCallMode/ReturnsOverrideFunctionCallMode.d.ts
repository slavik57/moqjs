import { OverrideFunctionCallMode } from './OverrideFunctionCallMode';
export declare class ReturnsOverrideFunctionCallMode extends OverrideFunctionCallMode {
    getReturnValue: (...args: any[]) => any;
    constructor(getReturnValue: (...args: any[]) => any);
}
