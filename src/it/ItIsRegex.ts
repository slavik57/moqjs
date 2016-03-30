import { ItIsBase } from './ItIsBase';
import { ItIsAny } from './ItIsAny';

export class ItIsRegex extends ItIsBase {
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
