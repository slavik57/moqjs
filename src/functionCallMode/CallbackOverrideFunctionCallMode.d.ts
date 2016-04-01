import { OverrideFunctionCallMode } from './OverrideFunctionCallMode';
export declare class CallbackOverrideFunctionCallMode extends OverrideFunctionCallMode {
    callbackFunction: (...args: any[]) => void;
    constructor(callbackFunction: (...args: any[]) => void);
}
