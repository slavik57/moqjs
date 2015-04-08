'use strict';

module moqJS {
    export class FunctionProxyConfigurations {
        public callBase: boolean;
        public isStrict: boolean;
        public moleReturnValue: boolean;

        public functionCallMode: IFunctionCallMode;

        constructor() {
            this.callBase = true;
            this.isStrict = false;
            this.moleReturnValue = false;
            this.functionCallMode = new InvokeFunctionCallMode();
        }
    }
}