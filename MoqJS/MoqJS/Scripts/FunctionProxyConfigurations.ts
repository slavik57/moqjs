'use strict';

module moqJS {
    export class FunctionProxyConfigurations {
        // Configurations
        public callBase: boolean;

        // Communication
        public isVerifying: boolean;
        public numberOfMatches: number;

        public functionOverride: (...args: any[]) => any;

        constructor() {
            this.callBase = true;

            this.isVerifying = false;
            this.numberOfMatches = 0;
        }
    }
}