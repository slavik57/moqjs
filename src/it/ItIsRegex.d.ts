import { ItIsBase } from './ItIsBase';
export declare class ItIsRegex extends ItIsBase {
    regExp: RegExp;
    constructor(regExp: RegExp);
    match(argument: any): boolean;
    private _isString(argument);
}
