import { ITimes } from './ITimes';
export declare class TimesBase implements ITimes {
    expected: number;
    constructor(expected: number);
    match(actual: number): boolean;
}
