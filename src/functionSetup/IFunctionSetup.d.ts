export interface IFunctionSetup {
    lazyReturns(returnFunction: Function): IFunctionSetup;
    lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup;
    returns(value: any): IFunctionSetup;
    returnsInOrder(values: any[]): IFunctionSetup;
    callback(callback: Function): IFunctionSetup;
    lazyThrows(errorReturningFunction: Function): IFunctionSetup;
    throws(error: any): IFunctionSetup;
}
