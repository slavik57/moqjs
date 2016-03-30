import { ItIsBase } from './ItIsBase';
export declare class ItIsInRange extends ItIsBase {
    minimumValue: number;
    maximumValue: number;
    constructor(minimumValue: number, maximumValue: number);
    match(argument: any): boolean;
}
