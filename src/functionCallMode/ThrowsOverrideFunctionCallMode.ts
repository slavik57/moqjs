import { OverrideFunctionCallMode } from './OverrideFunctionCallMode';

export class ThrowsOverrideFunctionCallMode extends OverrideFunctionCallMode {
  constructor(public getErrorToThrow: (...args: any[]) => any) {
    super(getErrorToThrow);
  }
}
