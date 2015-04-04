'use strict';

module Tests {
    export class TestObject {
        public static PRIVATE_FUNCTION_NAME = '_privateFunction';

        public static staticFunctionCalled: () => void;
        public onNoArgumentsFunctionCalled: () => void;
        public onOneArgumentsFunctionCalled: (arg1: any) => void;
        public onManyArgumentsFunctionCalled: (arg1: any, arg2: any, arg3: any) => void;
        public onReturnung1FunctionCalled: () => void;
        public onPrivateFunctionCalled: (arg1: any) => void;

        public onGetterCalled: () => void;
        public onSetterCalled: (value: any) => void;
        public onGetterOfGetterAndSetterCalled: () => void;
        public onSetterOfGetterAndSetterCalled: (value: any) => void;


        public getterValue: any;
        public setterValue: any;
        public getterAndSetterValue: any;

        public get getter() {
            if (this.onGetterCalled) {
                this.onGetterCalled();
            }

            return this.getterValue;
        }

        public set setter(value: any) {
            this.setterValue = value;

            if (this.onSetterCalled) {
                this.onSetterCalled(value);
            }
        }

        public get getterAndSetter() {
            if (this.onGetterOfGetterAndSetterCalled) {
                this.onGetterOfGetterAndSetterCalled();
            }

            return this.getterAndSetterValue;
        }

        public set getterAndSetter(value: any) {
            this.getterAndSetterValue = value;

            if (this.onSetterOfGetterAndSetterCalled) {
                this.onSetterOfGetterAndSetterCalled(value);
            }
        }

        public static staticFunction() {
            if (this.staticFunctionCalled) {
                this.staticFunctionCalled();
            }
        }

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

    export class TestObjectSon extends TestObject {
    }
}