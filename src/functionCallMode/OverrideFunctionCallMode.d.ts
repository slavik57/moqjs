import { IFunctionCallMode } from './IFunctionCallMode';
export declare class OverrideFunctionCallMode implements IFunctionCallMode {
    override: (...args: any[]) => any;
    constructor(override: (...args: any[]) => any);
}
