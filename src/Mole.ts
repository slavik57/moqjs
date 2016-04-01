import { FunctionProxy } from './functionProxy/FunctionProxy';
import { FunctionProxyConfigurations } from './functionProxy/FunctionProxyConfigurations';
import { IFunctionSetup } from './functionSetup/IFunctionSetup';
import { FunctionSetup } from './functionSetup/FunctionSetup';
import { ITimes } from './times/ITimes';
import { VerifyFunctionCallMode } from './functionCallMode/VerifyFunctionCallMode';
import { InvokeFunctionCallMode } from './functionCallMode/InvokeFunctionCallMode';

export class Mole<T> {
  private static _moles = [];

  private _functionProxies: FunctionProxy[];
  private _propertyGetterProxies: FunctionProxy[];
  private _propertySetterProxies: FunctionProxy[];
  private _FunctionProxyConfigurations: FunctionProxyConfigurations;

  constructor(public object: T) {
    this._FunctionProxyConfigurations = new FunctionProxyConfigurations();
    this._FunctionProxyConfigurations.callBase = true;

    this._setFunctionProxies();
    this._setPropertiesProxies();

    Mole._moles.push(this);
  }

  public dispose() {
    for (var i = 0; i < this._functionProxies.length; i++) {
      var proxy: FunctionProxy = this._functionProxies[i];

      this.object[proxy.originalFunctionName] = proxy.originalFunction;
    }

    for (var i = 0; i < this._propertyGetterProxies.length; i++) {
      var proxy: FunctionProxy = this._propertyGetterProxies[i];

      var descriptor = this._getPropertyDescriptor(this.object, proxy.originalFunctionName);

      descriptor.get = <any>proxy.originalFunction;

      this._setProperty(this.object, proxy.originalFunctionName, descriptor);
    }

    for (var i = 0; i < this._propertySetterProxies.length; i++) {
      var proxy: FunctionProxy = this._propertySetterProxies[i];

      var descriptor = this._getPropertyDescriptor(this.object, proxy.originalFunctionName);

      descriptor.set = <any>proxy.originalFunction;

      this._setProperty(this.object, proxy.originalFunctionName, descriptor);
    }

    var thisMoleIndex = Mole._moles.indexOf(this);
    Mole._moles.splice(thisMoleIndex, 1);
  }

  public get callBase() {
    return this._FunctionProxyConfigurations.callBase;
  }

  public set callBase(value: boolean) {
    this._FunctionProxyConfigurations.callBase = value;
  }

  public get isStrict() {
    return this._FunctionProxyConfigurations.isStrict;
  }

  public set isStrict(value: boolean) {
    this._FunctionProxyConfigurations.isStrict = value;
  }

  public get moleReturnValue() {
    return this._FunctionProxyConfigurations.moleReturnValue;
  }

  public set moleReturnValue(value: boolean) {
    this._FunctionProxyConfigurations.moleReturnValue = value;
  }

  public setup(functionCall: (object: T) => any): IFunctionSetup {
    return new FunctionSetup(functionCall, this.object, this._FunctionProxyConfigurations);
  }

  public setupPrivate(privatePropertyName: string, ...functionArguments: any[]): IFunctionSetup {
    var descriptor = this._getPropertyDescriptor(this.object, privatePropertyName);

    if (descriptor.value) {
      return this.setup((object: T) => {
        var privateFunction: Function = object[privatePropertyName];
        privateFunction.apply(object, functionArguments);
      });
    }

    if (functionArguments.length < 1 && descriptor.get) {
      return this.setup((object: T) => {
        descriptor.get.apply(object, functionArguments);
      });
    }

    if (functionArguments.length === 1 && descriptor.set) {
      return this.setup((object: T) => {
        descriptor.set.apply(object, functionArguments);
      });
    }

    throw 'Should be an existing function/getter/setter with appropriate number of arguments';
  }

  public verify(functionCall: (object: T) => any, times?: ITimes): boolean {
    var verifyMode = new VerifyFunctionCallMode();
    this._FunctionProxyConfigurations.functionCallMode = verifyMode;

    functionCall(this.object);

    this._FunctionProxyConfigurations.functionCallMode = new InvokeFunctionCallMode();

    var numberOfMatches: number = verifyMode.numberOfMatches;
    if (!times) {
      return numberOfMatches > 0;
    }

    return times.match(numberOfMatches);
  }

  public verifyPrivate(privateFunctionName: string, functionArguments: any[], times?: ITimes): boolean {
    var functionCall = (object: T) => {
      var privateFunction: Function = object[privateFunctionName];
      privateFunction.apply(object, functionArguments);
    };

    return this.verify(functionCall, times);
  }

  public static findMoleByObject<T>(object: T): Mole<T> {
    if (object === null || object === undefined) {
      return null;
    }

    for (var i = 0; i < Mole._moles.length; i++) {
      var mole: Mole<T> = Mole._moles[i];

      if (mole.object === object) {
        return mole;
      }
    }

    return null;
  }

  private _setFunctionProxies() {
    this._functionProxies = [];

    var propertyNames: string[] = this._getObjectPropertyNames();

    for (var i = 0; i < propertyNames.length; i++) {
      try {
        var propertyName = propertyNames[i];
        var descriptor = this._getPropertyDescriptor(this.object, propertyName);

        var propertyValue = descriptor.value;

        if (typeof (propertyValue) != "function") {
          continue;
        }

        var functionProxy = new FunctionProxy(propertyName, propertyValue, this.object, this._FunctionProxyConfigurations);
        this._functionProxies.push(functionProxy);

        this._setFunctionProxy(this._functionProxies, this._functionProxies.length - 1, propertyName);
      } catch (e) {
      }
    }
  }

  private _getObjectPropertyNames() {
    var propertyNames: string[] = Object.getOwnPropertyNames(this.object);
    for (var propertyName in this.object) {
      if (propertyNames.lastIndexOf(propertyName) < 0) {
        propertyNames.push(propertyName);
      }
    }

    return propertyNames;
  }

  private _setFunctionProxy(proxies: FunctionProxy[], proxyNumber: number, functionName: string) {
    this.object[functionName] = (...args: any[]) => proxies[proxyNumber].callFunction(args);
  }

  private _setPropertiesProxies() {
    this._propertyGetterProxies = [];
    this._propertySetterProxies = [];

    var propertyNames: string[] = this._getObjectPropertyNames();

    for (var i = 0; i < propertyNames.length; i++) {
      try {
        var propertyName = propertyNames[i];

        var descriptor = this._getPropertyDescriptor(this.object, propertyName);
        if (!descriptor) {
          continue;
        }

        if (descriptor.get) {
          this._setPropertyGetterProxy(propertyName, descriptor);
        }

        if (descriptor.set) {
          this._setPropertySetterProxy(propertyName, descriptor);
        }

        if (descriptor.get || descriptor.set) {
          this._setProperty(this.object, propertyName, descriptor);
        }
      } catch (e) {
      }
    }
  }

  private _getPropertyDescriptor(obj: any, propertyName: string): PropertyDescriptor {
    var descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
    if (descriptor) {
      return descriptor;
    }

    if (!obj.__proto__) {
      return undefined;
    }

    return this._getPropertyDescriptor(obj.__proto__, propertyName);
  }

  private _setProperty(obj: any, propertyName: string, propertyDescriptor) {
    Object.defineProperty(obj, propertyName, propertyDescriptor);
  }

  private _setPropertyGetterProxy(propertyName: string, descriptor: PropertyDescriptor) {
    var functionProxy = new FunctionProxy(propertyName, descriptor.get, this.object, this._FunctionProxyConfigurations);
    this._propertyGetterProxies.push(functionProxy);

    descriptor.get = () => functionProxy.callFunction([]);
  }

  private _setPropertySetterProxy(propertyName: string, descriptor: PropertyDescriptor) {
    var functionProxy = new FunctionProxy(propertyName, descriptor.set, this.object, this._FunctionProxyConfigurations);
    this._propertySetterProxies.push(functionProxy);

    descriptor.set = (value: any) => functionProxy.callFunction([value]);
  }
}
