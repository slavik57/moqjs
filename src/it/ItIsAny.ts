import {ItIsBase} from './ItIsBase';

export class ItIsAny extends ItIsBase {
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
