import { TimesBase } from './TimesBase';

export class MoreTimes extends TimesBase {
  constructor(expected: number) {
    super(expected);
  }

  public match(actual: number): boolean {
    return actual > this.expected;
  }
}
