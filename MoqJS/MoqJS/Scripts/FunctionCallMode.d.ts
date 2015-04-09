declare module moqJS {
    interface IFunctionCallMode {
    }
    class InvokeFunctionCallMode implements IFunctionCallMode {
    }
    class VerifyFunctionCallMode implements IFunctionCallMode {
        public numberOfMatches: number;
        constructor();
    }
    class OverrideFunctionCallMode implements IFunctionCallMode {
        public override: (...args: any[]) => any;
        constructor(override: (...args: any[]) => any);
    }
    class ReturnsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        public getReturnValue: (...args: any[]) => any;
        constructor(getReturnValue: (...args: any[]) => any);
    }
    class ThrowsOverrideFunctionCallMode extends OverrideFunctionCallMode {
        public getErrorToThrow: (...args: any[]) => any;
        constructor(getErrorToThrow: (...args: any[]) => any);
    }
    class CallbackOverrideFunctionCallMode extends OverrideFunctionCallMode {
        public callbackFunction: (...args: any[]) => void;
        constructor(callbackFunction: (...args: any[]) => void);
    }
}
