'use strict';

module Tests {
    export class TestObject {
        public onNoArgumentsFunctionCalled: () => void;
        public onOneArgumentsFunctionCalled: (arg1: any) => void;
        public onManyArgumentsFunctionCalled: (arg1: any, arg2: any, arg3: any) => void;

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
    }
}