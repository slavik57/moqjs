import { IFunctionCallMode } from './IFunctionCallMode';

export class OverrideFunctionCallMode implements IFunctionCallMode {
  constructor(public override: (...args: any[]) => any) {
  }
}
