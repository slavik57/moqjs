import { OverrideFunctionCallMode } from './OverrideFunctionCallMode';

export class ReturnsOverrideFunctionCallMode extends OverrideFunctionCallMode {
  constructor(public getReturnValue: (...args: any[]) => any) {
    super(getReturnValue);
  }
}
