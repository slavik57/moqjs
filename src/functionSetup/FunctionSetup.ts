import { IFunctionSetup } from './IFunctionSetup';
import { FunctionProxyConfigurations } from '../functionProxy/FunctionProxyConfigurations';
import { ReturnsOverrideFunctionCallMode } from '../functionCallMode/ReturnsOverrideFunctionCallMode';
import { CallbackOverrideFunctionCallMode } from '../functionCallMode/CallbackOverrideFunctionCallMode';
import { ThrowsOverrideFunctionCallMode } from '../functionCallMode/ThrowsOverrideFunctionCallMode';
import { OverrideFunctionCallMode } from '../functionCallMode/OverrideFunctionCallMode';
import { InvokeFunctionCallMode } from '../functionCallMode/InvokeFunctionCallMode';

export class FunctionSetup<T> implements IFunctionSetup {
  constructor(public functionCall: (object: T) => any, public object: T, public functionProxyConfigurations: FunctionProxyConfigurations) {
  }

  public lazyReturns(returnFunction: Function): IFunctionSetup {
    var overrideMode = new ReturnsOverrideFunctionCallMode((...args: any[]) => {
      return returnFunction.apply(this.object, args);
    });

    return this._callWithOverrideMode(overrideMode);
  }

  public lazyReturnsInOrder(returnFunctions: Function[]): IFunctionSetup {
    // NOTE: Clone to keep all given values and not change the orinial array
    var functions = returnFunctions.map(func => func);

    var overrideMode = new ReturnsOverrideFunctionCallMode((...args: any[]) => {
      if (functions.length < 1) {
        return undefined;
      }

      var firstFunction = functions.shift();

      return firstFunction.apply(this.object, args);
    });

    return this._callWithOverrideMode(overrideMode);
  }

  public returns(value: any): IFunctionSetup {
    var overrideMode = new ReturnsOverrideFunctionCallMode(() => {
      return value;
    });

    return this._callWithOverrideMode(overrideMode);
  }

  public returnsInOrder(values: any[]): IFunctionSetup {
    var itemsToReturnFunctions = values.map(value => {
      return () => value;
    });

    return this.lazyReturnsInOrder(itemsToReturnFunctions);
  }

  public callback(callback: Function): IFunctionSetup {
    var overrideMode = new CallbackOverrideFunctionCallMode((...args: any[]) => {
      callback.apply(this.object, args);
    });

    return this._callWithOverrideMode(overrideMode);
  }

  public lazyThrows(errorReturningFunction: Function): IFunctionSetup {
    var overrideMode = new ThrowsOverrideFunctionCallMode((...args: any[]) => {
      return errorReturningFunction.apply(this.object, args);
    });

    return this._callWithOverrideMode(overrideMode);
  }

  public throws(error: any): IFunctionSetup {
    return this.lazyThrows(() => error);
  }

  private _callWithOverrideMode(overrideMode: OverrideFunctionCallMode): IFunctionSetup {
    this.functionProxyConfigurations.functionCallMode = overrideMode;

    this.functionCall(this.object);

    this.functionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

    return this;
  }
}
