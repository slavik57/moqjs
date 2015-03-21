'use strict';

module moqJS {
    export class FunctionProxyConfigurations {
        public callBase: boolean;

        public functionCallMode: IFunctionCallMode;

        constructor() {
            this.callBase = true;
            this.functionCallMode = new InvokeFunctionCallMode();
        }
    }
}