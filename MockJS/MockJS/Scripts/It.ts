'use strict';

module mockJS {
    export interface IItIs {
        match(argument: any): boolean;
    }

    class ItIsAny implements IItIs {
        constructor(public expectedType: Function) {
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

    export class It {
        public static isAny(type: Function): any {
            return new ItIsAny(type);
        }

        public static is<T>(predicate: (argument: T) => boolean): any {
            // TODO...
            return null;
        }
    }
}