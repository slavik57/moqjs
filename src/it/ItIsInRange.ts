import { ItIsBase } from './ItIsBase';

export class ItIsInRange extends ItIsBase {
  constructor(public minimumValue: number, public maximumValue: number) {
    super();
  }

  public match(argument: any): boolean {
    if (isNaN(argument)) {
      return false;
    }

    return this.minimumValue <= argument && argument <= this.maximumValue;
  }
}
