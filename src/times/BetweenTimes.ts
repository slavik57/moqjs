import { ITimes } from './ITimes';

export class BetweenTimes implements ITimes {
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
