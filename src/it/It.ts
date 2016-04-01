import { ItIsBase } from './ItIsBase';
import { ItIsAny } from './ItIsAny';
import { ItIs } from './ItIs';
import { ItIsInRange } from './ItIsInRange';
import { ItIsRegex } from './ItIsRegex';

export class It {
  public static isAny(type: Function): any {
    return new ItIsAny(type);
  }

  public static is<T>(predicate: (argument: T) => boolean): any {
    return new ItIs(predicate);
  }

  public static isInRange(minimumValue: number, maximumValue: number): any {
    return new ItIsInRange(minimumValue, maximumValue);
  }

  public static isRegExp(regExp: RegExp): any {
    return new ItIsRegex(regExp);
  }
}
