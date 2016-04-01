import { expect } from 'chai';
import { TestObject} from '../testsCommon/TestObject';
import { FunctionProxyConfigurations } from '../../src/functionProxy/FunctionProxyConfigurations';
import { FunctionSetup } from '../../src/functionSetup/FunctionSetup';
import { ReturnsOverrideFunctionCallMode } from '../../src/functionCallMode/ReturnsOverrideFunctionCallMode';
import { OverrideFunctionCallMode } from '../../src/functionCallMode/OverrideFunctionCallMode';
import { InvokeFunctionCallMode } from '../../src/functionCallMode/InvokeFunctionCallMode';
import { CallbackOverrideFunctionCallMode } from '../../src/functionCallMode/CallbackOverrideFunctionCallMode';
import { ThrowsOverrideFunctionCallMode } from '../../src/functionCallMode/ThrowsOverrideFunctionCallMode';

describe('FunctionSetup', () => {
  var argument;
  var testObject: TestObject;
  var functionProxyConfigurations: FunctionProxyConfigurations;
  var oneArgumentFunctionSetup: FunctionSetup<TestObject>;
  var returning1FunctionSetup: FunctionSetup<TestObject>;

  beforeEach(() => {
    argument = {};
    testObject = new TestObject();
    functionProxyConfigurations = new FunctionProxyConfigurations();

    oneArgumentFunctionSetup = new FunctionSetup((object: TestObject) => object.oneArgumentsFunction(argument),
      testObject,
      functionProxyConfigurations);

    returning1FunctionSetup = new FunctionSetup((object: TestObject) => object.returning1Function(),
      testObject,
      functionProxyConfigurations);
  });

  describe('constructor', () => {

    it('should initialize correctly', () => {
      // Arrange
      var testObject = new TestObject();
      var functionCall = (object: TestObject) => object.returning1Function();
      var functionProxyConfigurations = new FunctionProxyConfigurations();

      // Act
      var functionSetup = new FunctionSetup(functionCall, testObject, functionProxyConfigurations);

      // Assert
      expect(functionSetup.object).to.be.equal(testObject);
      expect(functionSetup.functionCall).to.be.equal(functionCall);
      expect(functionSetup.functionProxyConfigurations).to.be.equal(functionProxyConfigurations);
    });

  });

  describe('returns', () => {

    it('should call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      returning1FunctionSetup.returns(4);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('should call when the override type is returns', () => {
      // Arrange
      var newReturnValue = {};

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.returns(newReturnValue);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(ReturnsOverrideFunctionCallMode);
    });

    it('should call when the override contains function that returns the new value', () => {
      // Arrange
      var newReturnValue = {};

      var actualResult;
      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;

        actualResult = functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.returns(newReturnValue);

      // Assert
      expect(actualResult).to.be.equal(newReturnValue);
    });

    it('should call when the override contains function that returns the new value 2', () => {
      // Arrange
      var newReturnValue = {};

      var actualResult;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualResult = functionCallMode.override();
      };

      // Act
      oneArgumentFunctionSetup.returns(newReturnValue);

      // Assert
      expect(actualResult).to.be.equal(newReturnValue);
    });

    it('should not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var newReturnValue = {};

      // Act
      oneArgumentFunctionSetup.returns(newReturnValue);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should call functionCall with same parameter', () => {
      // Arrange
      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      // Act
      oneArgumentFunctionSetup.returns(4);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('after returns functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.returns(4);

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode);
    });

    it('should return the same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.returns(4);

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

  });

  describe('returnsInOrder', () => {

    it('should call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      returning1FunctionSetup.returnsInOrder([4, 5]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('should call when the override type is returns', () => {
      // Arrange
      var newReturnValue1 = {};
      var newReturnValue2 = {};
      var newReturnValue3 = {};

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);

      // Assert
      expect(actualFunctionCallMode).to.be.instanceof(ReturnsOverrideFunctionCallMode);
    });

    it('should call when the override contains function that returns the new values', () => {
      // Arrange
      var newReturnValue1 = {};
      var newReturnValue2 = {};
      var newReturnValue3 = {};

      var actualResult1;
      var actualResult2;
      var actualResult3;
      var actualResult4;
      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;

        actualResult1 = functionCallMode.override();
        actualResult2 = functionCallMode.override();
        actualResult3 = functionCallMode.override();
        actualResult4 = functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);

      // Assert
      expect(actualResult1).to.be.equal(newReturnValue1);
      expect(actualResult2).to.be.equal(newReturnValue2);
      expect(actualResult3).to.be.equal(newReturnValue3);
      expect(actualResult4).to.be.equal(undefined);
    });

    it('should call when the override contains function that returns the new values 2', () => {
      // Arrange
      var newReturnValue1 = {};
      var newReturnValue2 = {};
      var newReturnValue3 = {};

      var actualResult1;
      var actualResult2;
      var actualResult3;
      var actualResult4;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualResult1 = functionCallMode.override();
        actualResult2 = functionCallMode.override();
        actualResult3 = functionCallMode.override();
        actualResult4 = functionCallMode.override();
      };

      // Act
      oneArgumentFunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);

      // Assert
      expect(actualResult1).to.be.equal(newReturnValue1);
      expect(actualResult2).to.be.equal(newReturnValue2);
      expect(actualResult3).to.be.equal(newReturnValue3);
      expect(actualResult4).to.be.equal(undefined);
    });

    it('should not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var newReturnValue = {};

      // Act
      oneArgumentFunctionSetup.returnsInOrder([newReturnValue]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should call functionCall with same parameter', () => {
      // Arrange
      var actualArg = 0;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      // Act
      oneArgumentFunctionSetup.returnsInOrder([4]);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('after returns functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.returnsInOrder([4]);

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode);
    });

    it('should return the same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.returnsInOrder([4]);

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

  });

  describe('lazyReturns', () => {

    it('lazyshould call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      returning1FunctionSetup.lazyReturns(() => 4);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('lazyshould call when the functionCallMode is OverrideFunctionCallMode', () => {
      // Arrange
      var returnValue = {};

      var returnFunction = () => {
        return returnValue;
      };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.lazyReturns(returnFunction);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode);
    });

    it('lazyshould call when the override type is returns', () => {
      // Arrange
      var returnValue = {};

      var returnFunction = () => {
        return returnValue;
      };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.lazyReturns(returnFunction);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(ReturnsOverrideFunctionCallMode);
    });

    it('lazyshould call when the override contains function that returns the new value', () => {
      // Arrange
      var returnValue = {};

      var returnFunction = () => {
        return returnValue;
      };

      var actualResult;
      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualResult = functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.lazyReturns(returnFunction);

      // Assert
      expect(actualResult).to.be.equal(returnValue);
    });

    it('lazyshould call when the override contains function that returns the new value 2', () => {
      // Arrange
      var newReturnValue = {};
      var returnFunction = () => {
        return newReturnValue;
      }

      var actualResult;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualResult = functionCallMode.override();
      };

      // Act
      oneArgumentFunctionSetup.lazyReturns(returnFunction);

      // Assert
      expect(actualResult).to.be.equal(newReturnValue);
    });

    it('lazyshould not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var returnFrunction = () => { };

      // Act
      oneArgumentFunctionSetup.lazyReturns(returnFrunction);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('lazyshould call functionCall with same parameter', () => {
      // Arrange
      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      // Act
      oneArgumentFunctionSetup.lazyReturns(() => 4);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('lazyafter returns functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.lazyReturns(() => 4);

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.instanceof(InvokeFunctionCallMode);
    });

    it('lazyshould return same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.lazyReturns(() => 4);

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

  });

  describe('lazyReturnsInOrder', () => {

    it('lazyshould call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      returning1FunctionSetup.lazyReturnsInOrder([() => 4, () => 5]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('lazyshould call when the functionCallMode is OverrideFunctionCallMode', () => {
      // Arrange
      var returnValue = {};

      var returnFunction = () => {
        return returnValue;
      };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode);
    });

    it('lazyshould call when the override type is returns', () => {
      // Arrange
      var returnValue = {};

      var returnFunction = () => {
        return returnValue;
      };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(ReturnsOverrideFunctionCallMode);
    });

    it('lazyshould call when the override contains function that returns the new values', () => {
      // Arrange
      var returnValue1 = {};
      var returnValue2 = {};
      var returnValue3 = {};

      var returnFunction1 = () => {
        return returnValue1;
      };
      var returnFunction2 = () => {
        return returnValue2;
      };
      var returnFunction3 = () => {
        return returnValue3;
      };

      var actualResult1;
      var actualResult2;
      var actualResult3;
      var actualResult4;
      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualResult1 = functionCallMode.override();
        actualResult2 = functionCallMode.override();
        actualResult3 = functionCallMode.override();
        actualResult4 = functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);

      // Assert
      expect(actualResult1).to.be.equal(returnValue1);
      expect(actualResult2).to.be.equal(returnValue2);
      expect(actualResult3).to.be.equal(returnValue3);
      expect(actualResult4).to.be.equal(undefined);
    });

    it('lazyshould call when the override contains function that returns the new values 2', () => {
      // Arrange
      var newReturnValue1 = {};
      var newReturnValue2 = {};
      var newReturnValue3 = {};

      var returnFunction1 = () => newReturnValue1;
      var returnFunction2 = () => newReturnValue2;
      var returnFunction3 = () => newReturnValue3;

      var actualResult1;
      var actualResult2;
      var actualResult3;
      var actualResult4;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualResult1 = functionCallMode.override();
        actualResult2 = functionCallMode.override();
        actualResult3 = functionCallMode.override();
        actualResult4 = functionCallMode.override();
      };

      // Act
      oneArgumentFunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);

      // Assert
      expect(actualResult1).to.be.equal(newReturnValue1);
      expect(actualResult2).to.be.equal(newReturnValue2);
      expect(actualResult3).to.be.equal(newReturnValue3);
      expect(actualResult4).to.be.equal(undefined);
    });

    it('lazyshould not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var returnFrunction = () => { };

      // Act
      oneArgumentFunctionSetup.lazyReturnsInOrder([returnFrunction]);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('lazyshould call functionCall with same parameter', () => {
      // Arrange
      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      // Act
      oneArgumentFunctionSetup.lazyReturnsInOrder([() => 4]);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('lazyafter returns functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.lazyReturnsInOrder([() => 4]);

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode);
    });

    it('lazyshould return same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.lazyReturnsInOrder([() => 4]);

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

  });

  describe('callback', () => {

    it('should call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      var callback = () => { };

      // Act
      returning1FunctionSetup.callback(callback);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('should call when the functionCallMode type is OverrideFunctionCallMode', () => {
      // Arrange
      var callback = () => { };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.callback(callback);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode);
    });

    it('should call when the override type is Callback', () => {
      // Arrange
      var callback = () => { };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.callback(callback);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(CallbackOverrideFunctionCallMode);
    });

    it('should call when the override contains the callback', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var callback = () => {
        numberOfTimesCalled++;
      };

      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.callback(callback);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('should call when the override contains the callback with same parameter', () => {
      // Arrange
      var actualArg;
      var callback = (_arg) => {
        actualArg = _arg;
      };

      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        functionCallMode.override(_arg);
      };

      // Act
      oneArgumentFunctionSetup.callback(callback);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('should not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var callback = () => { };

      // Act
      oneArgumentFunctionSetup.callback(callback);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should call functionCall with same parameter', () => {
      // Arrange
      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      var callback = () => { };

      // Act
      oneArgumentFunctionSetup.callback(callback);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('should return same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.callback(() => { });

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

    it('after callback functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.callback(() => { });

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode);
    });

  });

  describe('throws', () => {

    it('should call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      returning1FunctionSetup.throws(4);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('should call when the functionCallMode is OverrideFunctionCallMode', () => {
      // Arrange
      var error = {};

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.throws(error);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode);
    });

    it('should call when the override type is Throws', () => {
      // Arrange
      var error = {};

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.throws(error);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(ThrowsOverrideFunctionCallMode);
    });

    it('should call when the override contains function that returns the error', () => {
      // Arrange
      var error = {};

      var actualError;
      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualError = functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.throws(error);

      // Assert
      expect(actualError).to.be.equal(error);
    });

    it('should call when the override contains function that throws the error 2', () => {
      // Arrange
      var error = {};

      var actualError;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualError = functionCallMode.override();
      };

      // Act
      oneArgumentFunctionSetup.throws(error);

      // Assert
      expect(actualError).to.be.equal(error);
    });

    it('should not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var error = {};

      // Act
      oneArgumentFunctionSetup.throws(error);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('should call functionCall with same parameter', () => {
      // Arrange
      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      // Act
      oneArgumentFunctionSetup.throws(4);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('after callback functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.throws({});

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.instanceof(InvokeFunctionCallMode);
    });

    it('should return same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.throws({});

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

  });

  describe('lazyThrows', () => {

    it('lazyshould call functionCall', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      returning1FunctionSetup.lazyThrows(() => 'error');

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('lazyshould call when the functionCallMode is OverrideFunctionCallMode', () => {
      // Arrange
      var error = {};

      var errorReturningFunction = () => {
        return error;
      };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.lazyThrows(errorReturningFunction);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode);
    });

    it('lazyshould call when the override type is throws', () => {
      // Arrange
      var error = {};

      var errorReturningFunction = () => {
        return error;
      };

      var actualFunctionCallMode;
      testObject.onReturnung1FunctionCalled = () => {
        actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
      };

      // Act
      returning1FunctionSetup.lazyThrows(errorReturningFunction);

      // Assert
      expect(actualFunctionCallMode).to.be.an.instanceof(ThrowsOverrideFunctionCallMode);
    });

    it('lazyshould call when the override contains function that returns the error', () => {
      // Arrange
      var error = {};

      var errorReturningFunction = () => {
        return error;
      };

      var actualError;
      testObject.onReturnung1FunctionCalled = () => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualError = functionCallMode.override();
      };

      // Act
      returning1FunctionSetup.lazyThrows(errorReturningFunction);

      // Assert
      expect(actualError).to.be.equal(error);
    });

    it('lazyshould call when the override contains function that throws the error 2', () => {
      // Arrange
      var error = {};
      var errorReturningFunction = () => {
        return error;
      }

      var actualError;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        var functionCallMode = <OverrideFunctionCallMode>functionProxyConfigurations.functionCallMode;
        actualError = functionCallMode.override();
      };

      // Act
      oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);

      // Assert
      expect(actualError).to.be.equal(error);
    });

    it('lazyshould not call other function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      testObject.onReturnung1FunctionCalled = () => {
        numberOfTimesCalled++;
      };

      var errorReturningFunction = () => { };

      // Act
      oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('lazyshould call functionCall with same parameter', () => {
      // Arrange
      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = _arg;
      }

      // Act
      oneArgumentFunctionSetup.lazyThrows(() => 4);

      // Assert
      expect(actualArg).to.be.equal(argument);
    });

    it('lazyafter returns functionCallMode should be InvokeFunctionCallMode', () => {
      // Act
      oneArgumentFunctionSetup.lazyThrows(() => 4);

      // Assert
      expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode);
    });

    it('lazyshould return same function setup object', () => {
      // Act
      var functionSetup = oneArgumentFunctionSetup.lazyThrows(() => 4);

      // Assert
      expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
    });

  });

});
