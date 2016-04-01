import { ITimes} from './ITimes';

export class TimesBase implements ITimes {
  constructor(public expected: number) {
  }

  public match(actual: number): boolean {
    return false;
  }
}
