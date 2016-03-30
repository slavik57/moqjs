import { OverrideFunctionCallMode } from './OverrideFunctionCallMode';

export class CallbackOverrideFunctionCallMode extends OverrideFunctionCallMode {
  constructor(public callbackFunction: (...args: any[]) => void) {
    super(callbackFunction);
  }
}
