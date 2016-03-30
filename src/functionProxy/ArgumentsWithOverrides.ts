import { OverrideFunctionCallMode } from '../functionCallMode/OverrideFunctionCallMode';

export class ArgumentsWithOverrides {
  constructor(public exptectedArguments: any[], public override: OverrideFunctionCallMode) {
  }
}
