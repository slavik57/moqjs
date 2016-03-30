export declare class It {
    static isAny(type: Function): any;
    static is<T>(predicate: (argument: T) => boolean): any;
    static isInRange(minimumValue: number, maximumValue: number): any;
    static isRegExp(regExp: RegExp): any;
}
