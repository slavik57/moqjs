import { IFunctionCallMode } from './IFunctionCallMode';

export class VerifyFunctionCallMode implements IFunctionCallMode {
  public numberOfMatches: number;

  constructor() {
    this.numberOfMatches = 0;
  }
}
