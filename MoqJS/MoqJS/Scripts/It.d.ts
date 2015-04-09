declare module moqJS {
    class ItIsBase {
        public match(argument: any): boolean;
    }
    class It {
        static isAny(type: Function): ItIsBase;
        static is<T>(predicate: (argument: T) => boolean): ItIsBase;
        static isInRange(minimumValue: number, maximumValue: number): ItIsBase;
        static isRegExp(regExp: RegExp): ItIsBase;
    }
}
