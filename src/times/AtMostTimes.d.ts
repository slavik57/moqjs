import { TimesBase } from './TimesBase';
export declare class AtMostTimes extends TimesBase {
    constructor(expected: number);
    match(actual: number): boolean;
}
