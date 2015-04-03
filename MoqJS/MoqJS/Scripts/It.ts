'use strict';

module moqJS {
    export class ItIsBase {
        public match(argument: any): boolean {
            return false;
        }
    }

    class ItIsAny extends ItIsBase {
        constructor(public expectedType: Function) {
            super();
        }

        public match(argument: any): boolean {
            if (argument === null ||
                argument === undefined) {
                return false;
            }

            return argument.constructor === this.expectedType ||
                argument instanceof this.expectedType;
        }
    }

    class ItIs<T> extends ItIsBase {
        constructor(public predicate: (argument: T) => boolean) {
            super();
        }

        public match(argument: any): boolean {
            return this.predicate(argument);
        }
    }

    class ItIsInRange extends ItIsBase {
        constructor(public minimumValue: number, public maximumValue: number) {
            super();
        }

        public match(argument: any): boolean {
            if (isNaN(argument)) {
                return false;
            }

            return this.minimumValue <= argument && argument <= this.maximumValue;
        }
    }

    class ItIsRegex extends ItIsBase {
        constructor(public regExp: RegExp) {
            super();
        }

        public match(argument: any): boolean {
            if (!this._isString(argument)) {
                return false;
            }

            return this.regExp.test(argument);
        }

        private _isString(argument: any): boolean {
            var isString = new ItIsAny(String);

            return isString.match(argument);
        }
    }

    export class It {
        public static isAny(type: Function): ItIsBase {
            return new ItIsAny(type);
        }

        public static is<T>(predicate: (argument: T) => boolean): ItIsBase {
            return new ItIs(predicate);
        }

        public static isInRange(minimumValue: number, maximumValue: number): ItIsBase {
            return new ItIsInRange(minimumValue, maximumValue);
        }

        public static isRegExp(regExp: RegExp): ItIsBase {
            return new ItIsRegex(regExp);
        }
    }
}