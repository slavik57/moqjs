declare module Tests {
    class TestObject {
        static PRIVATE_FUNCTION_NAME: string;
        static PRIVATE_GETTER_NAME: string;
        static PRIVATE_SETTER_NAME: string;
        static PRIVATE_GETTER_AND_SETTER_NAME: string;
        static staticFunctionCalled: () => void;
        public onNoArgumentsFunctionCalled: () => void;
        public onOneArgumentsFunctionCalled: (arg1: any) => void;
        public onManyArgumentsFunctionCalled: (arg1: any, arg2: any, arg3: any) => void;
        public onReturnung1FunctionCalled: () => void;
        public onPrivateFunctionCalled: (arg1: any) => void;
        public onGetterCalled: () => void;
        public onSetterCalled: (value: any) => void;
        public onGetterOfGetterAndSetterCalled: () => void;
        public onSetterOfGetterAndSetterCalled: (value: any) => void;
        public onPrivateGetterCalled: () => void;
        public onPrivateSetterCalled: (value: any) => void;
        public onPrivateGetterOfGetterAndSetterCalled: () => void;
        public onPrivateSetterOfGetterAndSetterCalled: (value: any) => void;
        public getterValue: any;
        public setterValue: any;
        public getterAndSetterValue: any;
        public privateGetterValue: any;
        public privateSetterValue: any;
        public privateGetterAndSetterValue: any;
        public complexReturnFunction(): TestObject;
        public complexGetterFunction : TestObject;
        public getter : any;
        public setter : any;
        public getterAndSetter : any;
        static staticFunction(): void;
        public noArgumentsFunction(): void;
        public oneArgumentsFunction(arg1: any): void;
        public manyArgumentsFunction(arg1: any, arg2: any, arg3: any): void;
        public returning1Function(): number;
        public callPrivateFunction(arg1: any): number;
        private _privateFunction(arg1);
        public callPrivateGetter(): any;
        public callPrivateSetter(value: any): void;
        public callPrivateGetterOfGetterAndSetter(): any;
        public callPrivateSetterOfGetterAndSetter(value: any): void;
        private _privateGetter;
        private _privateSetter;
        private _privateGetterAndSetter;
    }
    class TestObjectSon extends TestObject {
    }
}
