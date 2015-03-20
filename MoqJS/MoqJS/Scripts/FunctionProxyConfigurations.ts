'use strict';

module moqJS {
    export class FunctionProxyConfigurations {
        public isVerifying: boolean;
        public numberOfMatches: number;
        public callBase: boolean;

        constructor() {
            this.isVerifying = false;
            this.numberOfMatches = 0;
            this.callBase = true;
        }
    }
}