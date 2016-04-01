import { TimesBase } from './TimesBase';
export declare class ExactTimes extends TimesBase {
    constructor(expected: number);
    match(actual: number): boolean;
}
