import { TimesBase } from './TimesBase';
export declare class LessTimes extends TimesBase {
    constructor(expected: number);
    match(actual: number): boolean;
}
