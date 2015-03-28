'use strict';

module moqJS {
    export class FunctionProxyConfigurations {
        public callBase: boolean;
        public isStrict: boolean;

        public functionCallMode: IFunctionCallMode;

        constructor() {
            this.callBase = true;
            this.isStrict = false;
            this.functionCallMode = new InvokeFunctionCallMode();
        }
    }
}