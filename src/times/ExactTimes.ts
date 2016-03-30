import { TimesBase } from './TimesBase';

export class ExactTimes extends TimesBase {
  constructor(expected: number) {
    super(expected);
  }

  public match(actual: number): boolean {
    return actual === this.expected;
  }
}
