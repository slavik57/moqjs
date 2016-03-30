import { ITimes } from './ITimes';
export declare class BetweenTimes implements ITimes {
    minimumExpected: number;
    maximumExpected: number;
    constructor(minimumExpected: number, maximumExpected: number);
    match(actual: number): boolean;
}
