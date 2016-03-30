import { ITimes } from './ITimes';
import { LessTimes } from './LessTimes';
import { AtMostTimes } from './AtMostTimes';
import { ExactTimes } from './ExactTimes';
import { AtLeastTimes } from './AtLeastTimes';
import { MoreTimes } from './MoreTimes';
import { BetweenTimes } from './BetweenTimes';

export class Times {

  public static lessThan(expected: number): ITimes {
    return new LessTimes(expected);
  }

  public static atMost(expected: number): ITimes {
    return new AtMostTimes(expected);
  }

  public static exact(expected: number): ITimes {
    return new ExactTimes(expected);
  }

  public static atLeast(expected: number): ITimes {
    return new AtLeastTimes(expected);
  }

  public static moreThan(expected: number): ITimes {
    return new MoreTimes(expected);
  }

  public static between(minimum: number, maximum: number): ITimes {
    return new BetweenTimes(minimum, maximum);
  }
}
