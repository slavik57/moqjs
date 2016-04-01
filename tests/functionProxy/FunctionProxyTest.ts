import { expect } from 'chai';
import { FunctionProxy } from '../../src/functionProxy/FunctionProxy';
import { FunctionProxyConfigurations } from '../../src/functionProxy/FunctionProxyConfigurations';
import { TestObject } from '../testsCommon/TestObject';
import { VerifyFunctionCallMode } from '../../src/functionCallMode/VerifyFunctionCallMode';
import { InvokeFunctionCallMode} from '../../src/functionCallMode/InvokeFunctionCallMode';
import { IFunctionCallMode} from '../../src/functionCallMode/IFunctionCallMode';
import { ItIsBase } from '../../src/it/ItIsBase';
import { CallbackOverrideFunctionCallMode } from '../../src/functionCallMode/CallbackOverrideFunctionCallMode';
import { It } from '../../src/it/It';
import { ReturnsOverrideFunctionCallMode } from '../../src/functionCallMode/ReturnsOverrideFunctionCallMode';
import { ThrowsOverrideFunctionCallMode} from '../../src/functionCallMode/ThrowsOverrideFunctionCallMode';

describe('FunctionProxy', () => {

  var thisObject: TestObject;
  var functionProxyConfigurations: FunctionProxyConfigurations;

  var noArgsFunctionProxy: FunctionProxy;
  var oneArgsFunctionProxy: FunctionProxy;
  var manyArgsFunctionProxy: FunctionProxy;
  var returning1FunctionProxy: FunctionProxy;

  beforeEach(() => {
    thisObject = new TestObject();

    functionProxyConfigurations = new FunctionProxyConfigurations();

    noArgsFunctionProxy = new FunctionProxy('noArgumentsFunction', thisObject.noArgumentsFunction,
      thisObject,
      functionProxyConfigurations);

    oneArgsFunctionProxy = new FunctionProxy('oneArgumentsFunction', thisObject.oneArgumentsFunction,
      thisObject,
      functionProxyConfigurations);

    manyArgsFunctionProxy = new FunctionProxy('manyArgumentsFunction', thisObject.manyArgumentsFunction,
      thisObject,
      functionProxyConfigurations);

    returning1FunctionProxy = new FunctionProxy('returning1Function', thisObject.returning1Function,
      thisObject,
      functionProxyConfigurations);
  });

  function setVerifyMode(): VerifyFunctionCallMode {
    var verifyFunctionCallMode = new VerifyFunctionCallMode();

    functionProxyConfigurations.functionCallMode = verifyFunctionCallMode;

    return verifyFunctionCallMode;
  }

  function setInvokeMode() {
    var invokeFunctionCallMode = new InvokeFunctionCallMode();

    functionProxyConfigurations.functionCallMode = invokeFunctionCallMode;
  }

  describe('constructor', () => {
    it('should initialize correctly', () => {
      // Arrange
      var originalFunction = new Function();
      var thisObject = {};
      var functionProxyConfigurations = new FunctionProxyConfigurations();

      // Act
      var proxy = new FunctionProxy('originalFunction', originalFunction, thisObject, functionProxyConfigurations);

      // Assert
      expect(proxy.thisObject).to.be.equal(thisObject);
      expect(proxy.originalFunction).to.be.equal(originalFunction);
      expect(proxy.functionProxyConfigurations).to.be.equal(functionProxyConfigurations);
    });
  });

  describe('callbase', () => {
    it('set to true, should call the original function', () => {
      // Arrange
      functionProxyConfigurations.callBase = true;

      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('callbase - set to false, should not call the original function', () => {
      // Arrange
      functionProxyConfigurations.callBase = false;

      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('callbase - set to false, should not return the original function result', () => {
      // Arrange
      functionProxyConfigurations.callBase = false;

      // Act
      var result = returning1FunctionProxy.callFunction([]);

      // Assert
      expect(result).not.to.be.equal(1);
    });

    it('callbase - set to false, should not return undefined', () => {
      // Arrange
      functionProxyConfigurations.callBase = false;

      // Act
      var result = returning1FunctionProxy.callFunction([]);

      // Assert
      expect(result).to.be.undefined;
    });
  });

  describe('callFunction - unknown mode', () => {
    it('should throw error', () => {
      // Arrange
      var unknownFunctionCallMode: IFunctionCallMode = {};

      functionProxyConfigurations.functionCallMode = unknownFunctionCallMode;

      //Act
      var action = () => noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(action).to.throw();
    });

  });

  describe('callFunction - invoke mode', () => {
    it('no arguments should call only the original function', () => {
      // Arrange
      var numberOfTimesNoArgumentsFunctionCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesNoArgumentsFunctionCalled++;
      };

      var numberOfTimesOneArgumentsFunctionCalled = 0;
      thisObject.onOneArgumentsFunctionCalled = () => {
        numberOfTimesOneArgumentsFunctionCalled++;
      };

      var numberOfTimesManyArgumentsFunctionCalled = 0;
      thisObject.onManyArgumentsFunctionCalled = () => {
        numberOfTimesManyArgumentsFunctionCalled++;
      };

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(1);
      expect(numberOfTimesOneArgumentsFunctionCalled).to.be.equal(0);
      expect(numberOfTimesManyArgumentsFunctionCalled).to.be.equal(0);
    });

    it('one arguments should call only the original function', () => {
      // Arrange
      var arg = {};

      var numberOfTimesNoArgumentsFunctionCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesNoArgumentsFunctionCalled++;
      };

      var actualArgs = [];
      thisObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArgs.push(_arg);
      };

      var numberOfTimesManyArgumentsFunctionCalled = 0;
      thisObject.onManyArgumentsFunctionCalled = () => {
        numberOfTimesManyArgumentsFunctionCalled++;
      };

      // Act
      oneArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(0);
      expect(numberOfTimesManyArgumentsFunctionCalled).to.be.equal(0);
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0]).to.be.equal(arg);
    });

    it('many arguments should call only the original function', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      var numberOfTimesNoArgumentsFunctionCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesNoArgumentsFunctionCalled++;
      };

      var numberOfTimesOneArgumentsFunctionCalled = 0;
      thisObject.onOneArgumentsFunctionCalled = () => {
        numberOfTimesOneArgumentsFunctionCalled++;
      };

      var args = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        // Assert
        args.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      // Act
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(0);
      expect(numberOfTimesOneArgumentsFunctionCalled).to.be.equal(0);
      expect(args.length).to.be.equal(1);
      expect(args[0].arg1).to.be.equal(arg1);
      expect(args[0].arg2).to.be.equal(arg2);
      expect(args[0].arg3).to.be.equal(arg3);
    });

    it('returning1Function - should return the original function result', () => {
      // Act
      var result = returning1FunctionProxy.callFunction([]);

      // Assert
      expect(result).to.be.equal(1);
    });
  });

  describe('callFunction - verify mode no arguments', () => {

    it('was not called should not find a match', () => {
      // Arrange
      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called should find a match', () => {
      // Arrange
      noArgsFunctionProxy.callFunction([]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice should find a match', () => {
      // Arrange
      noArgsFunctionProxy.callFunction([]);
      noArgsFunctionProxy.callFunction([]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(2);
    });

    it('was called with arguments should not find a match', () => {
      // Arrange
      noArgsFunctionProxy.callFunction([{}]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called with arguments and without arguments should find a match', () => {
      // Arrange
      noArgsFunctionProxy.callFunction([{}]);
      noArgsFunctionProxy.callFunction([]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with arguments verify with same arguments should find a match', () => {
      // Arrange
      var arg = {};
      noArgsFunctionProxy.callFunction([arg]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with arguments verify with different arguments should not find a match', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      noArgsFunctionProxy.callFunction([arg1]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg2]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

  });

  describe('callFunction - verify mode one argument', () => {
    it('was not called should not find a match', () => {
      // Arrange
      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var arg = {};

      // Act
      oneArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called should find a match', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([arg]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with IItIs which returns false, should not find a match', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([arg]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var itIs = new ItIsBase();
      itIs.match = () => {
        return false;
      };

      // Act
      noArgsFunctionProxy.callFunction([itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called with IItIs which returns true, should f-nd a match', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([arg]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var itIs = new ItIsBase();
      itIs.match = () => {
        return true;
      };

      // Act
      noArgsFunctionProxy.callFunction([itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice should find a match', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([arg]);
      noArgsFunctionProxy.callFunction([arg]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(2);
    });

    it('was called twice should find a match for first arg', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      noArgsFunctionProxy.callFunction([arg1]);
      noArgsFunctionProxy.callFunction([arg2]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg1]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice should find a match for second arg', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      noArgsFunctionProxy.callFunction([arg1]);
      noArgsFunctionProxy.callFunction([arg2]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg2]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice should not find a match for another arg', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      noArgsFunctionProxy.callFunction([arg1]);
      noArgsFunctionProxy.callFunction([arg2]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg3]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called without arguments should not find a match with arg', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called without arguments should find a match without arguments', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with IItIs which returns true 3 times, should find a match', () => {
      // Arrange
      var arg = {};

      noArgsFunctionProxy.callFunction([arg]);
      noArgsFunctionProxy.callFunction([arg]);
      noArgsFunctionProxy.callFunction([arg]);
      noArgsFunctionProxy.callFunction([arg]);
      noArgsFunctionProxy.callFunction([arg]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var numberOfTimesReturnedTrue = 0;
      var itIs = new ItIsBase();
      itIs.match = () => {
        numberOfTimesReturnedTrue++;
        return numberOfTimesReturnedTrue <= 3;
      };

      // Act
      noArgsFunctionProxy.callFunction([itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(3);
    });
  });

  describe('callFunction - verify mode many arguments', () => {

    it('was not called should not find a match', () => {
      // Arrange
      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called should find a match', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice should find a match', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(2);
    });

    it('was called twice with different sets should find a match for first set', () => {
      // Arrange
      var argSet1 = [{}, {}, {}];
      var argSet2 = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet1);
      manyArgsFunctionProxy.callFunction(argSet2);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction(argSet1);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice with different sets should find a match for second set', () => {
      // Arrange
      var argSet1 = [{}, {}, {}];
      var argSet2 = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet1);
      manyArgsFunctionProxy.callFunction(argSet2);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction(argSet2);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called twice with different sets should not find a match for different set', () => {
      // Arrange
      var argSet1 = [{}, {}, {}];
      var argSet2 = [{}, {}, {}];
      var argSet3 = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet1);
      manyArgsFunctionProxy.callFunction(argSet2);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction(argSet3);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('callFunction - verify mode many arguments - was called twice with different sets should not find a match for set with one different parameter', () => {
      // Arrange
      var argSet1 = [{}, {}, {}];
      var argSet2 = [{}, {}, {}];
      var argSet3 = [argSet1[0], argSet1[1], argSet2[2]];

      manyArgsFunctionProxy.callFunction(argSet1);
      manyArgsFunctionProxy.callFunction(argSet2);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction(argSet3);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called with less parameters should find a match', () => {
      // Arrange
      var argSet = [{}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction(argSet);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with more parameters should find a match', () => {
      // Arrange
      var argSet = [{}, {}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction(argSet);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with more parameters should not find a match with less parameters', () => {
      // Arrange
      var argSet = [{}, {}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      // Act
      manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], argSet[2]]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called with ItIs that returns false should not find a match with less parameters', () => {
      // Arrange
      var argSet = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var itIs = new ItIsBase();
      itIs.match = () => {
        return false;
      };

      // Act
      manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

    it('was called with ItIs that returns true should find a match with less parameters', () => {
      // Arrange
      var argSet = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var itIs = new ItIsBase()
      itIs.match = () => {
        return true;
      };

      // Act
      manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with ItIs that returns true 3 times should find a match with less parameters', () => {
      // Arrange
      var argSet = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);
      manyArgsFunctionProxy.callFunction(argSet);
      manyArgsFunctionProxy.callFunction(argSet);
      manyArgsFunctionProxy.callFunction(argSet);
      manyArgsFunctionProxy.callFunction(argSet);
      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var numberOfTimesReturnedTrue = 0;
      var itIs = new ItIsBase()
      itIs.match = () => {
        numberOfTimesReturnedTrue++;
        return numberOfTimesReturnedTrue <= 3;
      };

      // Act
      manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(3);
    });

    it('was called with 3 ItIs that returns true should find a match with less parameters', () => {
      // Arrange
      var argSet = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var itIs = new ItIsBase()
      itIs.match = () => {
        return true;
      };

      // Act
      manyArgsFunctionProxy.callFunction([itIs, itIs, itIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(1);
    });

    it('was called with 2 ItIs that returns true and one that returns false should find a match with less parameters', () => {
      // Arrange
      var argSet = [{}, {}, {}];

      manyArgsFunctionProxy.callFunction(argSet);

      var verifyMode: VerifyFunctionCallMode = setVerifyMode();

      var trueItIs = new ItIsBase()
      trueItIs.match = () => {
        return true;
      };

      var falseItIs = new ItIsBase()
      falseItIs.match = () => {
        return false;
      };

      // Act
      manyArgsFunctionProxy.callFunction([trueItIs, falseItIs, trueItIs]);

      // Assert
      expect(verifyMode.numberOfMatches).to.be.equal(0);
    });

  });

  describe('callFunction - override mode Callback', () => {

    it('should not call the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should not call the original function with arguments', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      manyArgsFunctionProxy.callFunction([{}, {}, {}]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should not call the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      noArgsFunctionProxy.callFunction([]);

      // Act
      setInvokeMode();
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should call the override function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var override = () => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      noArgsFunctionProxy.callFunction([]);

      // Act
      setInvokeMode();
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('calling the function should not call the override function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var override = () => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should call the override with same parameters', () => {
      // Arrange
      var args = [{}, {}, {}];

      var actualArgs = [];
      var override = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction(args);

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(args[0]);
      expect(actualArgs[0].arg2).to.be.equal(args[1]);
      expect(actualArgs[0].arg3).to.be.equal(args[2]);
    });

    it('invoking the function with other parameters should not call the override', () => {
      // Arrange
      var args = [{}, {}, {}];

      var numberOfTimesCalled = 0;
      var override = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function with other parameters should call the original function', () => {
      // Arrange
      var args1 = [{}, {}, {}];
      var args2 = [args1[0], args1[1], {}];

      var actualArgs = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var override = () => { };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args1);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction(args2);

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(args2[0]);
      expect(actualArgs[0].arg2).to.be.equal(args2[1]);
      expect(actualArgs[0].arg3).to.be.equal(args2[2]);
    });

    it('calling the function with ItIs and than invoking should call the override', () => {
      // Arrange
      var numberOfTimesManyArgumentsFunctionCalled = 0;
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        numberOfTimesManyArgumentsFunctionCalled++;
      };

      var arg1 = 1;
      var arg2 = 2;
      var arg3 = 3;

      var actualArgs = [];
      var override = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(numberOfTimesManyArgumentsFunctionCalled).to.be.equal(0);
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(arg1);
      expect(actualArgs[0].arg2).to.be.equal(arg2);
      expect(actualArgs[0].arg3).to.be.equal(arg3);
    });

    it('calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', () => {
      // Arrange
      var actualManyArgumentsFunctionArgs = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualManyArgumentsFunctionArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var arg1 = 1;
      var arg2 = '';
      var arg3 = 3;

      var numberOfTimesCalled = 0;
      var override = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };

      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(actualManyArgumentsFunctionArgs.length).to.be.equal(1);
      expect(actualManyArgumentsFunctionArgs[0].arg1).to.be.equal(arg1);
      expect(actualManyArgumentsFunctionArgs[0].arg2).to.be.equal(arg2);
      expect(actualManyArgumentsFunctionArgs[0].arg3).to.be.equal(arg3);
      expect(numberOfTimesCalled).to.be.equal(0);
    });

  });

  describe('callFunction - override mode Returns', () => {

    it('should not call the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should not call the original function with arguments', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      manyArgsFunctionProxy.callFunction([{}, {}, {}]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should not call the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      noArgsFunctionProxy.callFunction([]);

      // Act
      setInvokeMode();
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should call the override function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var override = () => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new CallbackOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      noArgsFunctionProxy.callFunction([]);

      // Act
      setInvokeMode();
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('calling the function should not call the override function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var override = () => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should call the override with same parameters', () => {
      // Arrange
      var args = [{}, {}, {}];

      var actualArgs = [];
      var override = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction(args);

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(args[0]);
      expect(actualArgs[0].arg2).to.be.equal(args[1]);
      expect(actualArgs[0].arg3).to.be.equal(args[2]);
    });

    it('invoking the function with other parameters should not call the override', () => {
      // Arrange
      var args = [{}, {}, {}];

      var numberOfTimesCalled = 0;
      var override = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function with other parameters should call the original function', () => {
      // Arrange
      var args1 = [{}, {}, {}];
      var args2 = [args1[0], args1[1], {}];

      var actualArgs = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var override = () => { };
      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args1);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction(args2);

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(args2[0]);
      expect(actualArgs[0].arg2).to.be.equal(args2[1]);
      expect(actualArgs[0].arg3).to.be.equal(args2[2]);
    });

    it('calling the function with ItIs and than invoking should call the override', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };

      var arg1 = 1;
      var arg2 = 2;
      var arg3 = 3;

      var actualArgs = [];
      var override = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(arg1);
      expect(actualArgs[0].arg2).to.be.equal(arg2);
      expect(actualArgs[0].arg3).to.be.equal(arg3);
    });

    it('calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', () => {
      // Arrange
      var actualArgs = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var arg1 = 1;
      var arg2 = '';
      var arg3 = 3;

      var numberOfTimesCalled = 0;
      var override = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };

      var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(arg1);
      expect(actualArgs[0].arg2).to.be.equal(arg2);
      expect(actualArgs[0].arg3).to.be.equal(arg3);
    });

  });

  describe('callFunction - override mode Throws', () => {

    it('should not call the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should not call the original function with arguments', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      manyArgsFunctionProxy.callFunction([{}, {}, {}]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should not call the original function', () => {
      // Arrange


      var numberOfTimesCalled = 0;
      thisObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var override = () => { };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      noArgsFunctionProxy.callFunction([]);

      // Act
      setInvokeMode();
      try {
        noArgsFunctionProxy.callFunction([]);
      } catch (e) {
      }

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should call the override function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var override = () => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      noArgsFunctionProxy.callFunction([]);

      // Act
      setInvokeMode();
      try {
        noArgsFunctionProxy.callFunction([]);
      } catch (er) {
      }

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('calling the function should not call the override function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var override = () => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      // Act
      noArgsFunctionProxy.callFunction([]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function should call the override with same parameters', () => {
      // Arrange
      var args = [{}, {}, {}];

      var actualArgs = [];
      var override = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args);

      // Act
      setInvokeMode();
      try {
        manyArgsFunctionProxy.callFunction(args);
      } catch (er) {
      }

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(args[0]);
      expect(actualArgs[0].arg2).to.be.equal(args[1]);
      expect(actualArgs[0].arg3).to.be.equal(args[2]);
    });

    it('invoking the function with other parameters should not call the override', () => {
      // Arrange
      var args = [{}, {}, {}];

      var numberOfTimesCalled = 0;
      var override = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args);

      // Act
      setInvokeMode();
      try {
        manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
      } catch (er) {
      }

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('invoking the function with other parameters should call the original function', () => {
      // Arrange
      var args1 = [{}, {}, {}];
      var args2 = [args1[0], args1[1], {}];

      var actualArgs = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var override = () => { };
      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction(args1);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction(args2);

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(args2[0]);
      expect(actualArgs[0].arg2).to.be.equal(args2[1]);
      expect(actualArgs[0].arg3).to.be.equal(args2[2]);
    });

    it('calling the function with ItIs and than invoking should call the override', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };

      var arg1 = 1;
      var arg2 = 2;
      var arg3 = 3;

      var actualArgs = [];
      var override = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

      // Act
      setInvokeMode();
      try {
        manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
      } catch (er) {
      }

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(arg1);
      expect(actualArgs[0].arg2).to.be.equal(arg2);
      expect(actualArgs[0].arg3).to.be.equal(arg3);
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', () => {
      // Arrange
      var actualArgs = [];
      thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualArgs.push({
          arg1: _arg1,
          arg2: _arg2,
          arg3: _arg3
        });
      };

      var arg1 = 1;
      var arg2 = '';
      var arg3 = 3;

      var numberOfTimesCalled = 0;
      var override = (_arg1, _arg2, _arg3) => {
        numberOfTimesCalled++;
      };

      var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
      functionProxyConfigurations.functionCallMode = functionCallMode;

      manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

      // Act
      setInvokeMode();
      manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

      // Assert
      expect(actualArgs.length).to.be.equal(1);
      expect(actualArgs[0].arg1).to.be.equal(arg1);
      expect(actualArgs[0].arg2).to.be.equal(arg2);
      expect(actualArgs[0].arg3).to.be.equal(arg3);
      expect(numberOfTimesCalled).to.be.equal(0);
    });

  });

  describe('callFunction - override mode mixed', () => {

    it('with ItIsAny should call all on invoke', () => {
      // Arrange
      var error = {};
      var numberOfTimesThrowsOverrideWasCalled = 0;
      var throwsOverride = (_arg) => {
        numberOfTimesThrowsOverrideWasCalled++;
        return error;
      }

      var returnValue = {};
      var numberOfTimesReturnsValueWasCalled = 0;
      var returnsOverride = (_arg) => {
        numberOfTimesReturnsValueWasCalled++;
        return returnValue;
      }

      var numberOfTimesCallbackOVerrideWasCalled = 0;
      var callbackOverride = (_arg) => {
        numberOfTimesCallbackOVerrideWasCalled++;
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      // Act
      setInvokeMode();
      oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(1);
      expect(numberOfTimesReturnsValueWasCalled).to.be.equal(1);
      expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(1);
    });

    it('with ItIsAny should call all on invoke with same parameter', () => {
      // Arrange
      var arg = {};

      var error = {};
      var throwsOverrideArgs = [];
      var throwsOverride = (_arg) => {
        throwsOverrideArgs.push(_arg);
        return error;
      }

      var returnValue = {};
      var returnsOverrideArgs = [];
      var returnsOverride = (_arg) => {
        returnsOverrideArgs.push(_arg);
        return returnValue;
      }

      var callbackOverrideArgs = [];
      var callbackOverride = (_arg) => {
        callbackOverrideArgs.push(_arg);
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([arg]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([arg]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([arg]);

      // Act
      setInvokeMode();
      oneArgsFunctionProxy.callFunction([arg]);

      // Assert
      expect(throwsOverrideArgs.length).to.be.equal(1);
      expect(returnsOverrideArgs.length).to.be.equal(1);
      expect(callbackOverrideArgs.length).to.be.equal(1);
      expect(throwsOverrideArgs[0]).to.be.equal(arg);
      expect(returnsOverrideArgs[0]).to.be.equal(arg);
      expect(callbackOverrideArgs[0]).to.be.equal(arg);
    });

    it('with value should call all on invoke', () => {
      // Arrange
      var error = {};
      var numberOfTimesThrowsOverrideWasCalled = 0;
      var throwsOverride = (_arg) => {
        numberOfTimesThrowsOverrideWasCalled++;
        return error;
      }

      var returnValue = {};
      var numberOfTimesReturnsValueWasCalled = 0;
      var returnsOverride = (_arg) => {
        numberOfTimesReturnsValueWasCalled++;
        return returnValue;
      }

      var numberOfTimesCallbackOVerrideWasCalled = 0;
      var callbackOverride = (_arg) => {
        numberOfTimesCallbackOVerrideWasCalled++;
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([1]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([1]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([1]);

      // Act
      setInvokeMode();
      oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(1);
      expect(numberOfTimesReturnsValueWasCalled).to.be.equal(1);
      expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(1);
    });

    it('with value should call only a callback on invoke', () => {
      // Arrange
      var error = {};
      var numberOfTimesThrowsOverrideWasCalled = 0;
      var throwsOverride = (_arg) => {
        numberOfTimesThrowsOverrideWasCalled++;
        return error;
      }

      var returnValue = {};
      var numberOfTimesReturnsValueWasCalled = 0;
      var returnsOverride = (_arg) => {
        numberOfTimesReturnsValueWasCalled++;
        return returnValue;
      }

      var numberOfTimesCallbackOVerrideWasCalled = 0;
      var callbackOverride = (_arg) => {
        numberOfTimesCallbackOVerrideWasCalled++;
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([0]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([0]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([1]);

      // Act
      setInvokeMode();
      oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(0);
      expect(numberOfTimesReturnsValueWasCalled).to.be.equal(0);
      expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(1);
    });

    it('with value should call only a returns on invoke', () => {
      // Arrange
      var error = {};
      var numberOfTimesThrowsOverrideWasCalled = 0;
      var throwsOverride = (_arg) => {
        numberOfTimesThrowsOverrideWasCalled++;
        return error;
      }

      var returnValue = {};
      var numberOfTimesReturnsValueWasCalled = 0;
      var returnsOverride = (_arg) => {
        numberOfTimesReturnsValueWasCalled++;
        return returnValue;
      }

      var numberOfTimesCallbackOVerrideWasCalled = 0;
      var callbackOverride = (_arg) => {
        numberOfTimesCallbackOVerrideWasCalled++;
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([0]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([1]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([0]);

      // Act
      setInvokeMode();
      oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(0);
      expect(numberOfTimesReturnsValueWasCalled).to.be.equal(1);
      expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(0);
    });

    it('with value should call only a throws on invoke', () => {
      // Arrange
      var error = {};
      var numberOfTimesThrowsOverrideWasCalled = 0;
      var throwsOverride = (_arg) => {
        numberOfTimesThrowsOverrideWasCalled++;
        return error;
      }

      var returnValue = {};
      var numberOfTimesReturnsValueWasCalled = 0;
      var returnsOverride = (_arg) => {
        numberOfTimesReturnsValueWasCalled++;
        return returnValue;
      }

      var numberOfTimesCallbackOVerrideWasCalled = 0;
      var callbackOverride = (_arg) => {
        numberOfTimesCallbackOVerrideWasCalled++;
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([1]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([0]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([0]);

      // Act
      setInvokeMode();
      try {
        oneArgsFunctionProxy.callFunction([1]);
      } catch (e) {
      }

      // Assert
      expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(1);
      expect(numberOfTimesReturnsValueWasCalled).to.be.equal(0);
      expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(0);
    });

    it('with ItIsAny should return the return value', () => {
      // Arrange
      var error = {};
      var throwsOverride = (_arg) => {
        return error;
      }

      var returnValue = {};
      var returnsOverride = (_arg) => {
        return returnValue;
      }

      var callbackOverride = (_arg) => {
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      // Act
      setInvokeMode();
      var result = oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(result).to.be.equal(returnValue);
    });

    it('with ItIsAny should throw the error', () => {
      // Arrange
      var error = {};
      var throwsOverride = (_arg) => {
        return error;
      }

      var returnValue = {};
      var returnsOverride = (_arg) => {
        return returnValue;
      }

      var callbackOverride = (_arg) => {
      }

      var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
      var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      // Act
      setInvokeMode();
      var actualError;
      try {
        oneArgsFunctionProxy.callFunction([1]);
      } catch (err) {
        actualError = err;
      }

      expect(actualError).to.be.equal(error);
    });

    it('with ItIsAny should throw the last error', () => {
      // Arrange
      var error1 = {};
      var throwsOverride1 = (_arg) => {
        return error1;
      }

      var error2 = {};
      var throwsOverride2 = (_arg) => {
        return error2;
      }

      var callbackOverride = (_arg) => {
      }

      var throwsOverrideCallMode1 = new ThrowsOverrideFunctionCallMode(throwsOverride1);
      var throwsOverrideCallMode2 = new ThrowsOverrideFunctionCallMode(throwsOverride2);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      // Act
      setInvokeMode();
      var actualError;
      try {
        oneArgsFunctionProxy.callFunction([1]);
      } catch (err) {
        actualError = err;
      }

      // Assert
      expect(actualError).to.be.equal(error2);
    });

    it('with ItIsAny should return the last return value', () => {
      // Arrange
      var returnValue1 = {};
      var returnsOverride1 = (_arg) => {
        return returnValue1;
      }

      var returnValue2 = {};
      var returnsOverride2 = (_arg) => {
        return returnValue2;
      }

      var callbackOverride = (_arg) => {
      }

      var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
      var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
      var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      // Act
      setInvokeMode();
      var result = oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(result).to.be.equal(returnValue2);
    });

    it('with ItIsAny should call all duplicates', () => {
      // Arrange
      var returnValue1 = {};
      var numberOfTimesReturnsOverride1WasCalled = 0;
      var returnsOverride1 = (_arg) => {
        numberOfTimesReturnsOverride1WasCalled++;
        return returnValue1;
      }

      var error1 = {};
      var numberOfTimesThrowsOverride1WasCalled = 0;
      var throwsOverride1 = (_arg) => {
        numberOfTimesThrowsOverride1WasCalled++;
        return error1;
      }

      var numberOfTimesCallbackOverride1WasCalled = 0;
      var callbackOverride1 = (_arg) => {
        numberOfTimesCallbackOverride1WasCalled++;
      }

      var error2 = {};
      var numberOfTimesThrowsOverride2WasCalled = 0;
      var throwsOverride2 = (_arg) => {
        numberOfTimesThrowsOverride2WasCalled++;
        return error2;
      }

      var returnValue2 = {};
      var numberOfTimesReturnsOverride2WasCalled = 0;
      var returnsOverride2 = (_arg) => {
        numberOfTimesReturnsOverride2WasCalled++;
        return returnValue2;
      }

      var numberOfTimesCallbackOverride2WasCalled = 0;
      var callbackOverride2 = (_arg) => {
        numberOfTimesCallbackOverride2WasCalled++;
      }

      var throwsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(throwsOverride1);
      var throwsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(throwsOverride2);
      var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
      var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
      var callbackOverrideCallMode1 = new CallbackOverrideFunctionCallMode(callbackOverride1);
      var callbackOverrideCallMode2 = new CallbackOverrideFunctionCallMode(callbackOverride2);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode1;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = callbackOverrideCallMode2;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
      oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

      // Act
      setInvokeMode();
      var result = oneArgsFunctionProxy.callFunction([1]);

      // Assert
      expect(numberOfTimesReturnsOverride1WasCalled).to.be.equal(1);
      expect(numberOfTimesThrowsOverride1WasCalled).to.be.equal(1);
      expect(numberOfTimesCallbackOverride1WasCalled).to.be.equal(1);
      expect(numberOfTimesThrowsOverride2WasCalled).to.be.equal(1);
      expect(numberOfTimesReturnsOverride2WasCalled).to.be.equal(1);
      expect(numberOfTimesCallbackOverride2WasCalled).to.be.equal(1);

      expect(result).to.be.equal(returnValue2);
    });

  });

  describe('callFunction - strict', () => {

    it('no setup should throw error', () => {
      // Arrange
      functionProxyConfigurations.isStrict = true;

      // Act
      var actualError;
      try {
        noArgsFunctionProxy.callFunction([]);
      } catch (error) {
        actualError = error;
      }

      // Assert
      expect(actualError).to.not.be.undefined;
    });

    it('has callback setup should not thow error', () => {
      // Arrange

      functionProxyConfigurations.isStrict = true;

      var functionCallMode = new CallbackOverrideFunctionCallMode(() => { });
      functionProxyConfigurations.functionCallMode = functionCallMode;
      noArgsFunctionProxy.callFunction([]);

      // Act
      var actualError;
      try {
        noArgsFunctionProxy.callFunction([]);
      } catch (error) {
        actualError = error;
      }

      // Assert
      expect(actualError).to.be.undefined;
    });

    it('has returns setup should not thow error', () => {
      // Arrange

      functionProxyConfigurations.isStrict = true;

      var functionCallMode = new ReturnsOverrideFunctionCallMode(() => 1);
      functionProxyConfigurations.functionCallMode = functionCallMode;
      noArgsFunctionProxy.callFunction([]);

      // Act
      var actualError;
      try {
        noArgsFunctionProxy.callFunction([]);
      } catch (error) {
        actualError = error;
      }

      // Assert
      expect(actualError).to.be.undefined;
    });

    it('has throws setup should thow the configured error', () => {
      // Arrange

      functionProxyConfigurations.isStrict = true;

      var thrownError = {};
      var functionCallMode = new ThrowsOverrideFunctionCallMode(() => { throw thrownError; });
      functionProxyConfigurations.functionCallMode = functionCallMode;
      noArgsFunctionProxy.callFunction([]);

      setInvokeMode();

      // Act
      var actualError;
      try {
        noArgsFunctionProxy.callFunction([]);
      } catch (error) {
        actualError = error;
      }

      // Assert
      expect(actualError).to.be.equal(thrownError);
    });

  });

});
