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
        public static isAny(type: Function): IItIs {
            return new ItIsAny(type);
        }
    }
}