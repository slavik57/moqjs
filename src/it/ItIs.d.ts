import { ItIsBase } from './ItIsBase';
export declare class ItIs<T> extends ItIsBase {
    predicate: (argument: T) => boolean;
    constructor(predicate: (argument: T) => boolean);
    match(argument: any): boolean;
}
