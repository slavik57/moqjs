'use strict';

module mockJS {
    export class FunctionProxyConfigurations {
        public isVerifying: boolean;
        public hasMatch: boolean;

        constructor() {
            this.isVerifying = false;
            this.hasMatch = false;
        }
    }
}