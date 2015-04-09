declare module moqJS {
    interface ITimes {
        match(actual: number): boolean;
    }
    class Times {
        static lessThan(expected: number): ITimes;
        static atMost(expected: number): ITimes;
        static exact(expected: number): ITimes;
        static atLeast(expected: number): ITimes;
        static moreThan(expected: number): ITimes;
        static between(minimum: number, maximum: number): ITimes;
    }
}
