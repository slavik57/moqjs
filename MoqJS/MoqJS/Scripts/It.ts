'use strict';

module moqJS {
    export class ItIsBase {
        match(argument: any): boolean {
            return false;
        }
    }

    class ItIsAny extends ItIsBase {
        constructor(public expectedType: Function) {
            super();
        }

        match(argument: any): boolean {
            if (argument === null ||
                argument === undefined) {
                return false;
            }

            return argument.constructor === this.expectedType ||
                argument instanceof this.expectedType;
        }
    }

    class Is<T> {
        constructor(public predicate: (argument: T) => boolean) {
        }

        match(argument: any): boolean {
            return this.predicate(argument);
        }
    }

    export class It {
        public static isAny(type: Function): any {
            return new ItIsAny(type);
        }

        public static is<T>(predicate: (argument: T) => boolean): any {
            return new Is(predicate);
        }
    }
}