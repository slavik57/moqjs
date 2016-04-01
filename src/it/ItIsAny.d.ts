import { ItIsBase } from './ItIsBase';
export declare class ItIsAny extends ItIsBase {
    expectedType: Function;
    constructor(expectedType: Function);
    match(argument: any): boolean;
}
