import { ItIsBase } from './ItIsBase';

export class ItIs<T> extends ItIsBase {
  constructor(public predicate: (argument: T) => boolean) {
    super();
  }

  public match(argument: any): boolean {
    return this.predicate(argument);
  }
}
