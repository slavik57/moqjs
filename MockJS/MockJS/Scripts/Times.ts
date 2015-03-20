'use strict';

module mockJS {
    export interface ITimes {
        match(actual: number): boolean;
    }

    class TimesBase implements ITimes {
        constructor(public expected: number) {
        }

        public match(actual: number): boolean {
            return false;
        }
    }

    class LessTimes extends TimesBase {
        constructor(expected: number) {
            super(expected);
        }

        public match(actual: number): boolean {
            return actual < this.expected;
        }
    }

    class AtMostTimes extends TimesBase {
        constructor(expected: number) {
            super(expected);
        }

        public match(actual: number): boolean {
            return actual <= this.expected;
        }
    }

    class ExactTimes extends TimesBase {
        constructor(expected: number) {
            super(expected);
        }

        public match(actual: number): boolean {
            return actual === this.expected;
        }
    }

    class AtLeastTimes extends TimesBase {
        constructor(expected: number) {
            super(expected);
        }

        public match(actual: number): boolean {
            return actual >= this.expected;
        }
    }

    class MoreTimes extends TimesBase {
        constructor(expected: number) {
            super(expected);
        }

        public match(actual: number): boolean {
            return actual > this.expected;
        }
    }

    class BetweenTimes implements ITimes {
        constructor(public minimumExpected: number, public maximumExpected: number) {
        }

        public match(actual: number): boolean {
            if (actual < this.minimumExpected) {
                return false;
            }

            if (actual > this.maximumExpected) {
                return false;
            }

            return true;
        }
    }

    export class Times {

        public static lessThan(expected: number): ITimes {
            return new LessTimes(expected);
        }

        public static atMost(expected: number): ITimes {
            return new AtMostTimes(expected);
        }

        public static exact(expected: number): ITimes {
            return new ExactTimes(expected);
        }

        public static atLeast(expected: number): ITimes {
            return new AtLeastTimes(expected);
        }

        public static moreThan(expected: number): ITimes {
            return new MoreTimes(expected);
        }

        public static between(minimum: number, maximum: number): ITimes {
            return new BetweenTimes(minimum, maximum);
        }
    }
}