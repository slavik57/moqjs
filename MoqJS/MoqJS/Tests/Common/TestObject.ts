'use strict';

module Tests {
    export class TestObject {
        public static PRIVATE_FUNCTION_NAME = '_privateFunction';

        public onNoArgumentsFunctionCalled: () => void;
        public onOneArgumentsFunctionCalled: (arg1: any) => void;
        public onManyArgumentsFunctionCalled: (arg1: any, arg2: any, arg3: any) => void;
        public onReturnung1FunctionCalled: () => void;
        public onPrivateFunctionCalled: (arg1: any) => void;

        public noArgumentsFunction() {
            if (this.onNoArgumentsFunctionCalled) {
                this.onNoArgumentsFunctionCalled();
            }
        }

        public oneArgumentsFunction(arg1: any) {
            if (this.onOneArgumentsFunctionCalled) {
                this.onOneArgumentsFunctionCalled(arg1);
            }
        }

        public manyArgumentsFunction(arg1: any, arg2: any, arg3: any) {
            if (this.onManyArgumentsFunctionCalled) {
                this.onManyArgumentsFunctionCalled(arg1, arg2, arg3);
            }
        }

        public returning1Function(): number {
            if (this.onReturnung1FunctionCalled) {
                this.onReturnung1FunctionCalled();
            }

            return 1;
        }

        public callPrivateFunction(arg1: any) {
            return this._privateFunction(arg1);
        }

        private _privateFunction(arg1: any) {
            if (this.onPrivateFunctionCalled) {
                this.onPrivateFunctionCalled(arg1);
            }

            return 1;
        }
    }
}