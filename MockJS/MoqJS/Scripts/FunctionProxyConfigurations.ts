'use strict';

module moqJS {
    export class FunctionProxyConfigurations {
        public isVerifying: boolean;

        public numberOfMatches: number;

        constructor() {
            this.isVerifying = false;
            this.numberOfMatches = 0;
        }
    }
}