import { expect } from 'chai';
import { TestObject } from './testsCommon/TestObject';
import { Mole, Times, It } from '../index';
import { ItIsBase } from '../src/it/ItIsBase';
import { ITimes } from '../src/times/ITimes';

describe('Mole', () => {
  var testObject: TestObject;
  var mole: Mole<TestObject>;

  beforeEach(() => {
    testObject = new TestObject();

    mole = new Mole(testObject);
  });

  afterEach(() => {
    mole.dispose();
  });

  describe('constructor', () => {

    it('should initialize correctly', () => {
      // Arrange
      var testObject = new TestObject();

      // Act
      var mole = new Mole(testObject);

      // Assert
      expect(mole.object).to.be.equal(testObject);
    });

  });

  describe('noArgumentsFunction', () => {

    it('should call only the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      var numberOfTimesNoArgumentsFunctionCalled = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesNoArgumentsFunctionCalled++;
      };

      testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onGetterCalled = shouldNotBeCalled;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onSetterCalled = shouldNotBeCalled;

      // Act
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(1);
    });

  });

  describe('oneArgumentsFunction', () => {

    it('one arguments should call only the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      var arg = {};

      testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onGetterCalled = shouldNotBeCalled;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onSetterCalled = shouldNotBeCalled;

      var actualArg;
      testObject.onOneArgumentsFunctionCalled = (_arg) => {
        actualArg = arg;
      };

      // Act
      testObject.oneArgumentsFunction(arg);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(actualArg).to.be.equal(arg);
    });

  });

  describe('manyArgumentsFunction', () => {

    it('many arguments should call only the original function', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onGetterCalled = shouldNotBeCalled;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onSetterCalled = shouldNotBeCalled;
      testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;

      var actualArg1;
      var actualArg2;
      var actualArg3;
      testObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
        actualArg1 = _arg1;
        actualArg2 = _arg2;
        actualArg3 = _arg3;
      };

      // Act
      testObject.manyArgumentsFunction(arg1, arg2, arg3);

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(actualArg1).to.be.equal(arg1);
      expect(actualArg2).to.be.equal(arg2);
      expect(actualArg3).to.be.equal(arg3);
    });

  });

  describe('getter', () => {

    it('should call only the original getter', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled
      testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onSetterCalled = shouldNotBeCalled;

      var numberOfTimesGetterCalled = 0;
      testObject.onGetterCalled = () => numberOfTimesGetterCalled++;

      var value = {};
      testObject.getterValue = value;

      // Act
      var actualValue = testObject.getter;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(numberOfTimesGetterCalled).to.be.equal(1);
      expect(actualValue).to.be.equal(value);
    });

    it('should call only the original getter', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled
      testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onSetterCalled = shouldNotBeCalled;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterCalled = shouldNotBeCalled;

      var numberOfTimesGetterOfGetterAndSetterCalled = 0;
      testObject.onGetterOfGetterAndSetterCalled = () => numberOfTimesGetterOfGetterAndSetterCalled++;

      var value = {};
      testObject.getterAndSetterValue = value;

      // Act
      var actualValue = testObject.getterAndSetter;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(numberOfTimesGetterOfGetterAndSetterCalled).to.be.equal(1);
      expect(actualValue).to.be.equal(value);
    });

  });

  describe('setter', () => {

    it('should call only the original setter', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled
      testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterCalled = shouldNotBeCalled;

      var numberOfTimesSetterCalled = 0;
      testObject.onSetterCalled = () => numberOfTimesSetterCalled++;

      var value = {};

      // Act
      testObject.setter = value;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(numberOfTimesSetterCalled).to.be.equal(1);
      expect(testObject.setterValue).to.be.equal(value);
    });

    it('should call only the original setter', () => {
      // Arrange
      var numberOfTimesCalled = 0;
      var shouldNotBeCalled = () => numberOfTimesCalled++;

      testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled
      testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
      testObject.onSetterCalled = shouldNotBeCalled;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
      testObject.onGetterCalled = shouldNotBeCalled;

      var numberOfTimesSetterOfGetterAndSetterCalled = 0;
      testObject.onSetterOfGetterAndSetterCalled = () => numberOfTimesSetterOfGetterAndSetterCalled++;

      var value = {};

      // Act
      testObject.getterAndSetter = value;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
      expect(numberOfTimesSetterOfGetterAndSetterCalled).to.be.equal(1);
      expect(testObject.getterAndSetterValue).to.be.equal(value);
    });

  });

  describe('verify', () => {

    it('should verify only the no arguments function', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.noArgumentsFunction();

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.true;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.false;
      expect(verifyGetter).to.be.false;
      expect(verifySetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.false;
      expect(verifyGetterAndSetterGetter).to.be.false;
    });

    it('should verify only the one argument function', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.oneArgumentsFunction(arg1);

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.false;
      expect(verifyOneArguments).to.be.true;
      expect(verifyManyArguments).to.be.false;
      expect(verifyGetter).to.be.false;
      expect(verifySetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.false;
      expect(verifyGetterAndSetterGetter).to.be.false;
    });

    it('should verify only the many argument function', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.manyArgumentsFunction(arg1, arg2, arg3);

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.false;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.true;
      expect(verifyGetter).to.be.false;
      expect(verifySetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.false;
      expect(verifyGetterAndSetterGetter).to.be.false;
    });

    it('should verify only the getter', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      var value = testObject.getter;

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.false;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.false;
      expect(verifyGetter).to.be.true;
      expect(verifySetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.false;
      expect(verifyGetterAndSetterGetter).to.be.false;
    });

    it('should verify only the setter', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.setter = arg1;

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.false;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.false;
      expect(verifyGetter).to.be.false;
      expect(verifySetter).to.be.true;
      expect(verifyGetterAndSetterSetter).to.be.false;
      expect(verifyGetterAndSetterGetter).to.be.false;
    });

    it('should verify only the getter of getter and setter', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      var value = testObject.getterAndSetter;

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.false;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.false;
      expect(verifyGetter).to.be.false;
      expect(verifySetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.true;
      expect(verifyGetterAndSetterGetter).to.be.false;
    });

    it('should verify only the setter of getter and setter', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.getterAndSetter = arg1;

      // Assert
      var verifyNoArguments = mole.verify(_ => _.noArgumentsFunction());
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));
      var verifyGetter = mole.verify(_ => _.getter);
      var verifySetter = mole.verify(_ => _.setter = arg1);
      var verifyGetterAndSetterGetter = mole.verify(_ => _.getterAndSetter);
      var verifyGetterAndSetterSetter = mole.verify(_ => _.getterAndSetter = arg1);

      expect(verifyNoArguments).to.be.false;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.false;
      expect(verifyGetter).to.be.false;
      expect(verifySetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.false;
      expect(verifyGetterAndSetterGetter).to.be.true;
    });

    it('after setups should count ok', () => {
      // Act
      mole.setup(_ => _.getter).callback(() => { });
      testObject.getter;
      testObject.getter;
      testObject.getter;
      testObject.getter;

      mole.setup(_ => _.oneArgumentsFunction(1)).callback(() => { });
      mole.setup(_ => _.oneArgumentsFunction(2)).callback(() => { });
      mole.setup(_ => _.oneArgumentsFunction(3)).callback(() => { });
      testObject.oneArgumentsFunction(1);
      testObject.oneArgumentsFunction(2);
      testObject.oneArgumentsFunction(2);
      testObject.oneArgumentsFunction(3);
      testObject.oneArgumentsFunction(3);
      testObject.oneArgumentsFunction(3);
      testObject.oneArgumentsFunction(4);
      testObject.oneArgumentsFunction(4);
      testObject.oneArgumentsFunction(4);
      testObject.oneArgumentsFunction(4);

      // Assert
      expect(mole.verify(_ => _.getter, Times.exact(4))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(1), Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(2), Times.exact(2))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(3), Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(4), Times.exact(4))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(It.isAny(Number)), Times.exact(10))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(It.isAny(Number)), Times.exact(11))).to.be.false;
    });

    it('complex test', () => {
      // Arrange
      var argSet = [{}, {}, {}, {}, {}, {}];

      // Act
      testObject.noArgumentsFunction();
      testObject.oneArgumentsFunction(argSet[0]);
      testObject.setter = argSet[0];
      testObject.getterAndSetter = argSet[0];
      testObject.getterAndSetter;
      testObject.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
      testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
      testObject.oneArgumentsFunction(argSet[2]);
      testObject.getterAndSetter;
      testObject.setter = argSet[2];
      testObject.getterAndSetter = argSet[2];
      testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
      testObject.oneArgumentsFunction(argSet[0]);
      testObject.setter = argSet[0];
      testObject.getterAndSetter;
      testObject.getterAndSetter = argSet[0];
      testObject.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
      testObject.getter;
      testObject.noArgumentsFunction();
      testObject.oneArgumentsFunction(argSet[0]);
      testObject.setter = argSet[0];
      testObject.getterAndSetter = argSet[0];
      testObject.getter;
      testObject.noArgumentsFunction();
      testObject.getterAndSetter;
      testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
      testObject.noArgumentsFunction();
      testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
      testObject.getter;
      testObject.setter = argSet[1];
      testObject.oneArgumentsFunction(argSet[1]);
      testObject.getterAndSetter = argSet[1];
      testObject.getterAndSetter = argSet[2];
      testObject.getterAndSetter = argSet[2];
      testObject.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
      testObject.getter;
      testObject.oneArgumentsFunction(argSet[2]);
      testObject.setter = argSet[2];
      testObject.setter = argSet[2];
      testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
      testObject.oneArgumentsFunction(argSet[2]);

      // Assert
      expect(mole.verify(_ => _.noArgumentsFunction())).to.be.true;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(4))).to.be.true;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(5))).to.be.false;
      expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(6))).to.be.false;

      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[0]))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[1]))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[3]))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(5))).to.be.false;

      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(5))).to.be.false;

      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(2))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(4))).to.be.false;

      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(3))).to.be.false;

      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(3))).to.be.false;

      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(3))).to.be.false;

      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(0))).to.be.true;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(3))).to.be.false;

      expect(mole.verify(_ => _.getter)).to.be.true;
      expect(mole.verify(_ => _.getter, Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.getter, Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.getter, Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.getter, Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.getter, Times.exact(4))).to.be.true;
      expect(mole.verify(_ => _.getter, Times.exact(5))).to.be.false;
      expect(mole.verify(_ => _.getter, Times.exact(6))).to.be.false;

      expect(mole.verify(_ => _.setter = argSet[0])).to.be.true;
      expect(mole.verify(_ => _.setter = argSet[1])).to.be.true;
      expect(mole.verify(_ => _.setter = argSet[2])).to.be.true;
      expect(mole.verify(_ => _.setter = argSet[3])).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[0], Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[0], Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[0], Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[0], Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.setter = argSet[0], Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[1], Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[1], Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.setter = argSet[1], Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[1], Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[2], Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[2], Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[2], Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[2], Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.setter = argSet[2], Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.setter = argSet[2], Times.exact(5))).to.be.false;

      expect(mole.verify(_ => _.getterAndSetter)).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(4))).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(5))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter, Times.exact(6))).to.be.false;

      expect(mole.verify(_ => _.getterAndSetter = argSet[0])).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter = argSet[1])).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2])).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter = argSet[3])).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[0], Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[0], Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[0], Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[0], Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter = argSet[0], Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[1], Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[1], Times.exact(1))).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter = argSet[1], Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[1], Times.exact(3))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2], Times.exact(0))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2], Times.exact(1))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2], Times.exact(2))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2], Times.exact(3))).to.be.true;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2], Times.exact(4))).to.be.false;
      expect(mole.verify(_ => _.getterAndSetter = argSet[2], Times.exact(5))).to.be.false;
    });

    it('times returns false should return false', () => {
      // Arrange
      var timesMole: ITimes = {
        match: () => { return false; }
      };

      // Act
      var result = mole.verify(_ => _.noArgumentsFunction(), timesMole);

      // Assert
      expect(result).to.be.false;
    });

    it('times returns true should return true', () => {
      // Arrange
      var timesMole: ITimes = {
        match: () => { return true; }
      };

      // Act
      var result = mole.verify(_ => _.noArgumentsFunction(), timesMole);

      // Assert
      expect(result).to.be.true;
    });

    it('ItIsBase returns false should return false', () => {
      // Arrange
      var itIs = new ItIsBase();
      itIs.match = () => false;

      testObject.setter = 1;

      // Act
      var result = mole.verify(_ => _.setter = itIs);

      // Assert
      expect(result).to.be.false;
    });

    it('ItIsBase returns false should return true', () => {
      // Arrange
      var itIs = new ItIsBase();
      itIs.match = () => true;

      testObject.setter = 1;

      // Act
      var result = mole.verify(_ => _.setter = itIs);

      // Assert
      expect(result).to.be.true;
    });

    describe('no arguments', () => {

      it('was not called should not find a match', () => {
        // Act
        var result = mole.verify(_ => _.noArgumentsFunction());

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 2 matches', () => {
        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should return true on 0 matches', () => {
        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should return false on 0 matches', () => {
        // Arrange
        testObject.noArgumentsFunction();

        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should return true on 1 matches', () => {
        // Arrange
        testObject.noArgumentsFunction();

        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should return false on 2 matches', () => {
        // Arrange
        testObject.noArgumentsFunction();

        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should return true on 2 matches', () => {
        // Arrange
        testObject.noArgumentsFunction();
        testObject.noArgumentsFunction();

        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should return false on 1 matches', () => {
        // Arrange
        testObject.noArgumentsFunction();
        testObject.noArgumentsFunction();

        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should return false on 3 matches', () => {
        // Arrange
        testObject.noArgumentsFunction();
        testObject.noArgumentsFunction();

        // Act
        var result = mole.verify(_ => _.noArgumentsFunction(), Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

    });

    describe('one argument', () => {

      it('was not called should not find a match', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 1 match', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 2 matches', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should find 0 matches', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should find a match', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should find 1 match', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should not find 2 matches', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should not verify 0 matches', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should find a match', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);
        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should find 2 matches', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);
        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not find 0 matches', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);
        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not find 1 matches', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);
        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not find 3 matches', () => {
        // Arrange
        var arg = {};

        testObject.oneArgumentsFunction(arg);
        testObject.oneArgumentsFunction(arg);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify first arg', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify first arg called 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify first arg called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
        testObject.oneArgumentsFunction(arg1);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify second arg was called', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify second arg was called 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify second arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify second arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify second arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify second arg was called 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should verify second arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called 3 times should not verify second arg was called 3 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg was called 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg3), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg3), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify with another arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(arg3), Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('ItIsBase returns false should return false', () => {
        // Arrange
        var itIs = new ItIsBase();
        itIs.match = () => false;

        testObject.oneArgumentsFunction(1);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(itIs));

        // Assert
        expect(result).to.be.false;
      });

      it('ItIsBase returns false should return true', () => {
        // Arrange
        var itIs = new ItIsBase();
        itIs.match = () => true;

        testObject.oneArgumentsFunction(1);

        // Act
        var result = mole.verify(_ => _.oneArgumentsFunction(itIs));

        // Assert
        expect(result).to.be.true;
      });

    });

    describe('many arguments', () => {

      it('was not called should not verify', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not verify for 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not verify for 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should verify for 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should verify', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should verify for 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should not verify for 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should not verify for 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify for 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify for 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify for 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify for 3 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.manyArgumentsFunction(arg1, arg2, arg3);
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should verify first set', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice with different sets should verify first set 1 time', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice with different sets should not verify first set 0 times', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should not verify first set 2 times', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should verify second set', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice with different sets should verify second set 1 time', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice with different sets should not verify second set 0 times', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]), Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should not verify second set 2 times', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should not verify another set', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should not verify another set 1 time', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]), Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should not verify another set 2 times', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]), Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice with different sets should verify another set 0 times', () => {
        // Arrange
        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]), Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('ItIsBase returns false should return false', () => {
        // Arrange
        var itIs = new ItIsBase();
        itIs.match = () => false;

        testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(itIs, itIs, itIs));

        // Assert
        expect(result).to.be.false;
      });

      it('ItIsBase returns true should return true', () => {
        // Arrange
        var itIs = new ItIsBase();
        itIs.match = () => true;

        testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(itIs, itIs, itIs));

        // Assert
        expect(result).to.be.true;
      });

      it('ItIsBase returns true and false should return false', () => {
        // Arrange
        var trueItIs = new ItIsBase();
        trueItIs.match = () => true;

        var falseItIs = new ItIsBase();
        falseItIs.match = () => false;

        testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(trueItIs, trueItIs, falseItIs));

        // Assert
        expect(result).to.be.false;
      });

      it('ItIsBase returns true and other arguments dont match should return false', () => {
        // Arrange
        var trueItIs = new ItIsBase();
        trueItIs.match = () => true;

        testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(trueItIs, trueItIs, 2));

        // Assert
        expect(result).to.be.false;
      });

      it('called many times ItIsBase returns true should return true', () => {
        // Arrange
        var trueItIs = new ItIsBase();
        trueItIs.match = () => true;

        testObject.manyArgumentsFunction(1, 1, 2);
        testObject.manyArgumentsFunction(1, 1, 1);
        testObject.manyArgumentsFunction(1, 1, 1);
        testObject.manyArgumentsFunction(1, 1, 2);
        testObject.manyArgumentsFunction(1, 1, 1);
        testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(trueItIs, trueItIs, 2), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('called many times ItIsBase returns true once should return true', () => {
        // Arrange
        var trueItIs = new ItIsBase();
        var numberOfTimesReturnedTrue = 0;
        trueItIs.match = () => {
          numberOfTimesReturnedTrue++;
          return numberOfTimesReturnedTrue <= 1;
        };

        testObject.manyArgumentsFunction(1, 1, 2);
        testObject.manyArgumentsFunction(1, 1, 1);
        testObject.manyArgumentsFunction(1, 1, 1);
        testObject.manyArgumentsFunction(1, 1, 2);
        testObject.manyArgumentsFunction(1, 1, 1);
        testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(1, trueItIs, 2), Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('called with numbers and strings should return only the strings', () => {
        // Arrange
        var numberItIs = It.isAny(Number);
        var stringItIs = It.isAny(String);

        testObject.manyArgumentsFunction(11, 1, 1);
        testObject.manyArgumentsFunction(12, 1, 2);
        testObject.manyArgumentsFunction(13, '1', 3);
        testObject.manyArgumentsFunction(14, 1, 4);
        testObject.manyArgumentsFunction(15, '112', 5);
        testObject.manyArgumentsFunction(16, 1, 6);

        // Act
        var result = mole.verify(_ => _.manyArgumentsFunction(numberItIs, stringItIs, numberItIs), Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

    });

    describe('getter', () => {

      it('was not called should not find a match', () => {
        // Act
        var result = mole.verify(_ => _.getter);

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 2 matches', () => {
        // Act
        var result = mole.verify(_ => _.getter, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should return true on 0 matches', () => {
        // Act
        var result = mole.verify(_ => _.getter, Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should return false on 0 matches', () => {
        // Arrange
        var value = testObject.getter;

        // Act
        var result = mole.verify(_ => _.getter, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should return true on 1 matches', () => {
        // Arrange
        var value = testObject.getter;

        // Act
        var result = mole.verify(_ => _.getter, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should return false on 2 matches', () => {
        // Arrange
        var value = testObject.getter;

        // Act
        var result = mole.verify(_ => _.getter, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should return true on 2 matches', () => {
        // Arrange
        var value1 = testObject.getter;
        var value2 = testObject.getter;

        // Act
        var result = mole.verify(_ => _.getter, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should return false on 1 matches', () => {
        // Arrange
        var value1 = testObject.getter;
        var value2 = testObject.getter;

        // Act
        var result = mole.verify(_ => _.getter, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should return false on 3 matches', () => {
        // Arrange
        var value1 = testObject.getter;
        var value2 = testObject.getter;

        // Act
        var result = mole.verify(_ => _.getter, Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find a match', () => {
        // Act
        var result = mole.verify(_ => _.getterAndSetter);

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 2 matches', () => {
        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should return true on 0 matches', () => {
        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should return false on 0 matches', () => {
        // Arrange
        var value = testObject.getterAndSetter;

        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should return true on 1 matches', () => {
        // Arrange
        var value = testObject.getterAndSetter;

        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should return false on 2 matches', () => {
        // Arrange
        var value = testObject.getterAndSetter;

        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should return true on 2 matches', () => {
        // Arrange
        var value1 = testObject.getterAndSetter;
        var value2 = testObject.getterAndSetter;

        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should return false on 1 matches', () => {
        // Arrange
        var value1 = testObject.getterAndSetter;
        var value2 = testObject.getterAndSetter;

        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should return false on 3 matches', () => {
        // Arrange
        var value1 = testObject.getterAndSetter;
        var value2 = testObject.getterAndSetter;

        // Act
        var result = mole.verify(_ => _.getterAndSetter, Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

    });

    describe('setter', () => {

      it('was not called should not find a match', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.setter = arg);

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 1 match', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 2 matches', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should find 0 matches', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should find a match', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg);

        // Assert
        expect(result).to.be.true;
      });

      it('was called should find 1 match', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should not find 2 matches', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should not verify 0 matches', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should find a match', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;
        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg);

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should find 2 matches', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;
        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not find 0 matches', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;
        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not find 1 matches', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;
        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not find 3 matches', () => {
        // Arrange
        var arg = {};

        testObject.setter = arg;
        testObject.setter = arg;

        // Act
        var result = mole.verify(_ => _.setter = arg, Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify first arg', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg1);

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify first arg called 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg1, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify first arg called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg1, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg1, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg1, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;
        testObject.setter = arg1;

        // Act
        var result = mole.verify(_ => _.setter = arg1, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify second arg was called', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2);

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify second arg was called 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify second arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify second arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify second arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify second arg was called 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should verify second arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called 3 times should not verify second arg was called 3 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg2, Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg3);

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg was called 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg3, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg3, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify with another arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.setter = arg1;
        testObject.setter = arg2;

        // Act
        var result = mole.verify(_ => _.setter = arg3, Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was not called should not find a match', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg);

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 1 match', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should not find 2 matches', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was not called should find 0 matches', () => {
        // Arrange
        var arg = {};

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should find a match', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg);

        // Assert
        expect(result).to.be.true;
      });

      it('was called should find 1 match', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called should not find 2 matches', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called should not verify 0 matches', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should find a match', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;
        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg);

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should find 2 matches', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;
        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not find 0 matches', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;
        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not find 1 matches', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;
        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not find 3 matches', () => {
        // Arrange
        var arg = {};

        testObject.getterAndSetter = arg;
        testObject.getterAndSetter = arg;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg, Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify first arg', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg1);

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify first arg called 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg1, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify first arg called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg1, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg1, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg1, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should verify first arg called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;
        testObject.getterAndSetter = arg1;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg1, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify second arg was called', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2);

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should verify second arg was called 1 time', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(1));

        // Assert
        expect(result).to.be.true;
      });

      it('was called twice should not verify second arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify second arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify second arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(0));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should not verify second arg was called 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called 3 times should verify second arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(2));

        // Assert
        expect(result).to.be.true;
      });

      it('was called 3 times should not verify second arg was called 3 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg2, Times.exact(3));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg3);

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg was called 1 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg3, Times.exact(1));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should not verify with another arg was called 2 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg3, Times.exact(2));

        // Assert
        expect(result).to.be.false;
      });

      it('was called twice should verify with another arg was called 0 times', () => {
        // Arrange
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        testObject.getterAndSetter = arg1;
        testObject.getterAndSetter = arg2;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = arg3, Times.exact(0));

        // Assert
        expect(result).to.be.true;
      });

      it('ItIsBase returns false should return false', () => {
        // Arrange
        var itIs = new ItIsBase();
        itIs.match = () => false;

        testObject.getterAndSetter = 1;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = itIs);

        // Assert
        expect(result).to.be.false;
      });

      it('ItIsBase returns false should return true', () => {
        // Arrange
        var itIs = new ItIsBase();
        itIs.match = () => true;

        testObject.getterAndSetter = 1;

        // Act
        var result = mole.verify(_ => _.getterAndSetter = itIs);

        // Assert
        expect(result).to.be.true;
      });

    });

  });

  describe('verifyPrivate', () => {

    it('should verify only the private function', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.callPrivateFunction(1);

      // Assert
      var verifyPrivateFunction = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [1]);
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

      expect(verifyPrivateFunction).to.be.true;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.false;
    });

    it('should verify only the many argument function', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      // Act
      testObject.manyArgumentsFunction(arg1, arg2, arg3);

      // Assert
      var verifyPrivateFunction = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [It.isAny(Object)]);
      var verifyOneArguments = mole.verify(_ => _.oneArgumentsFunction(arg1));
      var verifyManyArguments = mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

      expect(verifyPrivateFunction).to.be.false;
      expect(verifyOneArguments).to.be.false;
      expect(verifyManyArguments).to.be.true;
    });

    it('was not called should not find a match', () => {
      // Arrange
      var arg = {};

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg]);

      // Assert
      expect(result).to.be.false;
    });

    it('was not called should not find 1 match', () => {
      // Arrange
      var arg = {};

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

      // Assert
      expect(result).to.be.false;
    });

    it('was not called should not find 2 matches', () => {
      // Arrange
      var arg = {};

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

      // Assert
      expect(result).to.be.false;
    });

    it('was not called should find 0 matches', () => {
      // Arrange
      var arg = {};

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

      // Assert
      expect(result).to.be.true;
    });

    it('was called should find a match', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg]);

      // Assert
      expect(result).to.be.true;
    });

    it('was called should find 1 match', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

      // Assert
      expect(result).to.be.true;
    });

    it('was called should not find 2 matches', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

      // Assert
      expect(result).to.be.false;
    });

    it('was called should not verify 0 matches', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should find a match', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);
      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg]);

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should find 2 matches', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);
      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should not find 0 matches', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);
      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not find 1 matches', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);
      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not find 3 matches', () => {
      // Arrange
      var arg = {};

      testObject.callPrivateFunction(arg);
      testObject.callPrivateFunction(arg);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(3));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should verify first arg', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1]);

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should verify first arg called 1 time', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(1));

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should not verify first arg called 0 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(0));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not verify first arg called 2 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

      // Assert
      expect(result).to.be.false;
    });

    it('was called 3 times should not verify first arg called 2 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

      // Assert
      expect(result).to.be.false;
    });

    it('was called 3 times should verify first arg called 2 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);
      testObject.callPrivateFunction(arg1);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should verify second arg was called', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2]);

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should verify second arg was called 1 time', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

      // Assert
      expect(result).to.be.true;
    });

    it('was called twice should not verify second arg was called 2 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not verify second arg was called 0 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

      // Assert
      expect(result).to.be.false;
    });

    it('was called 3 times should not verify second arg was called 0 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

      // Assert
      expect(result).to.be.false;
    });

    it('was called 3 times should not verify second arg was called 1 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

      // Assert
      expect(result).to.be.false;
    });

    it('was called 3 times should verify second arg was called 2 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

      // Assert
      expect(result).to.be.true;
    });

    it('was called 3 times should not verify second arg was called 3 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(3));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not verify with another arg', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3]);

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not verify with another arg was called 1 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(1));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should not verify with another arg was called 2 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(2));

      // Assert
      expect(result).to.be.false;
    });

    it('was called twice should verify with another arg was called 0 times', () => {
      // Arrange
      var arg1 = {};
      var arg2 = {};
      var arg3 = {};

      testObject.callPrivateFunction(arg1);
      testObject.callPrivateFunction(arg2);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(0));

      // Assert
      expect(result).to.be.true;
    });

    it('times returns false should return false', () => {
      // Arrange
      var timesMole: ITimes = {
        match: () => { return false; }
      };

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

      // Assert
      expect(result).to.be.false;
    });

    it('times returns true should return true', () => {
      // Arrange
      var timesMole: ITimes = {
        match: () => { return true; }
      };

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

      // Assert
      expect(result).to.be.true;
    });

    it('one argument - ItIsBase returns false should return false', () => {
      // Arrange
      var itIs = new ItIsBase();
      itIs.match = () => false;

      testObject.callPrivateFunction(1);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

      // Assert
      expect(result).to.be.false;
    });

    it('one argument - ItIsBase returns false should return true', () => {
      // Arrange
      var itIs = new ItIsBase();
      itIs.match = () => true;

      testObject.callPrivateFunction(1);

      // Act
      var result = mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

      // Assert
      expect(result).to.be.true;
    });

  });

  describe('callBase', () => {

    it('set to true after constructor should call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original getter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalGetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onGetterCalled = originalGetterWasCalled;

      // Act
      testObject.getter;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalSetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onSetterCalled = originalSetterWasCalled;

      // Act
      testObject.setter = 1;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original getter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalGetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onGetterOfGetterAndSetterCalled = originalGetterWasCalled;

      // Act
      testObject.getterAndSetter;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original setter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalSetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onSetterOfGetterAndSetterCalled = originalSetterWasCalled;

      // Act
      testObject.getterAndSetter = 1;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to false after constructor should not call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var numberOfTimesCalled = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('set to false after constructor should not call the original getters and setters', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var numberOfTimesCalled = 0;
      var shouldNotCall = () => {
        numberOfTimesCalled++;
      }

      testObject.onGetterCalled = shouldNotCall;
      testObject.onSetterCalled = shouldNotCall;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotCall;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotCall;

      // Act
      testObject.getter;
      testObject.setter = 1;
      testObject.getterAndSetter;
      testObject.getterAndSetter = 1;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('set to true should return the original function value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      // Act
      var result = testObject.returning1Function();

      // Assert
      expect(result).to.be.equal(1);
    });

    it('set to true should return the original getter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var getterValue = {};
      testObject.getterValue = getterValue;

      // Act
      var result = testObject.getter;

      // Assert
      expect(result).to.be.equal(getterValue);
    });

    it('set to true should set the setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var setterValue = {};

      // Act
      testObject.setter = setterValue;

      // Assert
      expect(testObject.setterValue).to.be.equal(setterValue);
    });

    it('set to true should return the original getter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var getterAndSetterValue = {};
      testObject.getterAndSetterValue = getterAndSetterValue

      // Act
      var result = testObject.getterAndSetter;

      // Assert
      expect(result).to.be.equal(getterAndSetterValue);
    });

    it('set to true should set the setter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var getterAndSetterValue = {};

      // Act
      testObject.getterAndSetter = getterAndSetterValue;

      // Assert
      expect(testObject.getterAndSetterValue).to.be.equal(getterAndSetterValue);
    });

    it('set to false should not return the original function value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      // Act
      var result = testObject.returning1Function();

      // Assert
      expect(result).to.not.be.equal(1);
    });

    it('set to false should not return the original getter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var getterValue = {};
      testObject.getterValue = getterValue;

      // Act
      var result = testObject.getter;

      // Assert
      expect(result).to.not.be.equal(getterValue);
    });

    it('set to false should not set the setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var setterValue = {};

      // Act
      testObject.setter = setterValue;

      // Assert
      expect(testObject.setterValue).to.not.be.equal(setterValue);
    });

    it('set to false should not return the original getter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var getterAndSetterValue = {};
      testObject.getterAndSetterValue = getterAndSetterValue

      // Act
      var result = testObject.getterAndSetter;

      // Assert
      expect(result).to.not.be.equal(getterAndSetterValue);
    });

    it('set to false should not set the setter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var getterAndSetterValue = {};

      // Act
      testObject.getterAndSetter = getterAndSetterValue;

      // Assert
      expect(testObject.getterAndSetterValue).to.not.be.equal(getterAndSetterValue);
    });

    it('set to false should return undefined', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      // Act
      var result = testObject.returning1Function();

      // Assert
      expect(result).to.be.undefined;
    });

    it('set to false should return undefined from getters', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      testObject.getterValue = 1;
      testObject.getterAndSetterValue = 1;

      // Act
      var result1 = testObject.getter;
      var result2 = testObject.getterAndSetter;

      // Assert
      expect(result1).to.be.undefined;
      expect(result2).to.be.undefined;
    });

    it('set to true after constructor should call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original getter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalGetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onGetterCalled = originalGetterWasCalled;

      // Act
      testObject.getter;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalSetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onSetterCalled = originalSetterWasCalled;

      // Act
      testObject.setter = 1;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original getter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalGetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onGetterOfGetterAndSetterCalled = originalGetterWasCalled;

      // Act
      testObject.getterAndSetter;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to true after constructor should call the original setter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var numberOfTimesCalled = 0;
      var originalSetterWasCalled = () => {
        numberOfTimesCalled++;
      }

      testObject.onSetterOfGetterAndSetterCalled = originalSetterWasCalled;

      // Act
      testObject.getterAndSetter = 1;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

    it('set to false after constructor should not call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var numberOfTimesCalled = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled++;
      }

      // Act
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('set to false after constructor should not call the original getters and setters', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var numberOfTimesCalled = 0;
      var shouldNotCall = () => {
        numberOfTimesCalled++;
      }

      testObject.onGetterCalled = shouldNotCall;
      testObject.onSetterCalled = shouldNotCall;
      testObject.onGetterOfGetterAndSetterCalled = shouldNotCall;
      testObject.onSetterOfGetterAndSetterCalled = shouldNotCall;

      // Act
      testObject.getter;
      testObject.setter = 1;
      testObject.getterAndSetter;
      testObject.getterAndSetter = 1;

      // Assert
      expect(numberOfTimesCalled).to.be.equal(0);
    });

    it('set to true should return the original function value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      // Act
      var result = testObject.returning1Function();

      // Assert
      expect(result).to.be.equal(1);
    });

    it('set to true should return the original getter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var getterValue = {};
      testObject.getterValue = getterValue;

      // Act
      var result = testObject.getter;

      // Assert
      expect(result).to.be.equal(getterValue);
    });

    it('set to true should set the setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var setterValue = {};

      // Act
      testObject.setter = setterValue;

      // Assert
      expect(testObject.setterValue).to.be.equal(setterValue);
    });

    it('set to true should return the original getter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var getterAndSetterValue = {};
      testObject.getterAndSetterValue = getterAndSetterValue

      // Act
      var result = testObject.getterAndSetter;

      // Assert
      expect(result).to.be.equal(getterAndSetterValue);
    });

    it('set to true should set the setter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = true;

      var getterAndSetterValue = {};

      // Act
      testObject.getterAndSetter = getterAndSetterValue;

      // Assert
      expect(testObject.getterAndSetterValue).to.be.equal(getterAndSetterValue);
    });

    it('set to false should not return the original function value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      // Act
      var result = testObject.returning1Function();

      // Assert
      expect(result).to.not.be.equal(1);
    });

    it('set to false should not return the original getter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var getterValue = {};
      testObject.getterValue = getterValue;

      // Act
      var result = testObject.getter;

      // Assert
      expect(result).to.not.be.equal(getterValue);
    });

    it('set to false should not set the setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var setterValue = {};

      // Act
      testObject.setter = setterValue;

      // Assert
      expect(testObject.setterValue).to.not.be.equal(setterValue);
    });

    it('set to false should not return the original getter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var getterAndSetterValue = {};
      testObject.getterAndSetterValue = getterAndSetterValue

      // Act
      var result = testObject.getterAndSetter;

      // Assert
      expect(result).to.not.be.equal(getterAndSetterValue);
    });

    it('set to false should not set the setter of getter and setter value', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      var getterAndSetterValue = {};

      // Act
      testObject.getterAndSetter = getterAndSetterValue;

      // Assert
      expect(testObject.getterAndSetterValue).to.not.be.equal(getterAndSetterValue);
    });

    it('set to false should return undefined', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      // Act
      var result = testObject.returning1Function();

      // Assert
      expect(result).to.be.undefined;
    });

    it('set to false should return undefined from getters', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole(testObject);
      mole.callBase = false;

      testObject.getterValue = 1;
      testObject.getterAndSetterValue = 1;

      // Act
      var result1 = testObject.getter;
      var result2 = testObject.getterAndSetter;

      // Assert
      expect(result1).to.be.undefined;
      expect(result2).to.be.undefined;
    });

  });

  describe('setup', () => {

    describe('callback', () => {

      it('should not call callback if function is not called', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if getter is not called', () => {
        // Act
        mole.setup(_ => _.getter).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if setter is not called', () => {
        // Act
        mole.setup(_ => _.setter = 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if getter of getter and setter is not called', () => {
        // Act
        mole.setup(_ => _.getterAndSetter).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if setter of getter and setter is not called', () => {
        // Act
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should call callback when function is called', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.noArgumentsFunction();
      });

      it('should call callback when getter is called', () => {
        // Arrange
        mole.setup(_ => _.getter).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.getter;
      });

      it('should call callback when setter is called', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.setter = 1;
      });

      it('should call callback when getter of getter and setter is called', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.getterAndSetter;
      });

      it('should call callback when setter of getter and setter is called', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.getterAndSetter = 1;
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call the original getter', () => {
        // Arrange
        mole.setup(_ => _.getter).callback(() => { });

        testObject.onGetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.getter;
      });

      it('should not call the original setter', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => { });

        testObject.onSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.setter = 1;
      });

      it('should not call the original getter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => { });

        testObject.onGetterOfGetterAndSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.getterAndSetter;
      });

      it('should not call the original setter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).callback(() => { });

        testObject.onSetterOfGetterAndSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.getterAndSetter = 1;
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.oneArgumentsFunction(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .callback((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
            actualArg2 = _arg2;
            actualArg3 = _arg3;
          });

        // Act
        testObject.manyArgumentsFunction(arg1, arg2, arg3);
      });

      it('should pass the same parameters to setter', () => {
        // Arrange
        var arg = 1;

        mole.setup(_ => _.setter = It.isAny(Number)).callback((_arg) => {
          actualArg = arg;
        });

        // Act
        testObject.setter = arg;
      });

      it('should pass the same parameters to setter of getter and setter', () => {
        // Arrange
        var arg = 1;

        mole.setup(_ => _.getterAndSetter = It.isAny(Number)).callback((_arg) => {
          actualArg = arg;
        });

        // Act
        testObject.getterAndSetter = arg;
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;
        testObject.onGetterCalled = shouldNotHappen;
        testObject.onSetterCalled = shouldNotHappen;
        testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call other original functions 2', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;
        testObject.onGetterCalled = shouldNotHappen;
        testObject.onSetterCalled = shouldNotHappen;
        testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        testObject.getterAndSetter;
      });

      it('should not call other original functions 3', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;
        testObject.onGetterCalled = shouldNotHappen;
        testObject.onSetterCalled = shouldNotHappen;
        testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        testObject.setter = 1;
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.getter).callback(shouldNotHappen);
        mole.setup(_ => _.setter = 1).callback(shouldNotHappen);
        mole.setup(_ => _.getterAndSetter).callback(shouldNotHappen);
        mole.setup(_ => _.getterAndSetter = 1).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;
        testObject.onGetterCalled = shouldNotHappen;
        testObject.onSetterCalled = shouldNotHappen;
        testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not return the callback return value', () => {
        // Arrange
        mole.setup(_ => _.returning1Function()).callback(() => {
          return {};
        });

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.undefined;
      });

      it('should call all the callbacks when function is called', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        }).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		});

        // Act
        testObject.noArgumentsFunction();
      });

      it('should call all the callbacks when function is called for getter', () => {
        // Arrange
        mole.setup(_ => _.getter).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        }).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		});

        // Act
        testObject.getter;
      });

      it('should call all the callbacks when function is called for setter', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        }).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		});

        // Act
        testObject.setter = 1;
      });

      it('should call all the callbacks when function is called for getter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        }).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		});

        // Act
        testObject.getterAndSetter;
      });

      it('should call all the callbacks when function is called for setter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        }).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		});

        // Act
        testObject.getterAndSetter = 1;
      });

      it('should pass teh same parameters to all the callbacks when function is called', () => {
        // Arrange
        var arg = 12;

        var checkArgument = (_arg) => {
          actualArg = _arg;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .callback(checkArgument)
          .callback(checkArgument)
          .callback(checkArgument)
          .callback(checkArgument);

        // Act
        testObject.oneArgumentsFunction(arg);
      });

      it('should pass teh same parameters to all the callbacks when function is called 2', () => {
        // Arrange
        var arg1 = 11;
        var arg2 = 12;
        var arg3 = 13;

        var checkArgument = (_arg1, _arg2, _arg3) => {
          actualArg1 = _arg1;
          actualArg2 = _arg2;
          actualArg3 = _arg3;
        };

        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .callback(checkArgument)
          .callback(checkArgument)
          .callback(checkArgument)
          .callback(checkArgument);

        // Act
        testObject.manyArgumentsFunction(arg1, arg2, arg3);
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });

      it('should not affect verify for getter', () => {
        // Act
        mole.setup(_ => _.getter).callback(() => { });

        // Assert
        expect(mole.verify(_ => _.getter, Times.exact(0))).to.be.true;
      });

      it('should not affect verify for setter', () => {
        // Act
        mole.setup(_ => _.setter = 1).callback(() => { });

        // Assert
        expect(mole.verify(_ => _.setter = 1, Times.exact(0))).to.be.true;
      });

      it('should not affect verify for getter of getter and setter', () => {
        // Act
        mole.setup(_ => _.getterAndSetter).callback(() => { });

        // Assert
        expect(mole.verify(_ => _.getterAndSetter, Times.exact(0))).to.be.true;
      });

      it('should not affect verify for setter of getter and setter', () => {
        // Act
        mole.setup(_ => _.getterAndSetter = 1).callback(() => { });

        // Assert
        expect(mole.verify(_ => _.getterAndSetter = 1, Times.exact(0))).to.be.true;
      });

      it('setting setter should not affect getter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).callback(() => { });

        var value = {};
        testObject.getterAndSetterValue = value;

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        expect(result).to.be.equal(value);
      });

      it('setting getter should not affect setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => { });

        var value = {};

        // Act
        testObject.getterAndSetter = value;

        // Assert
        expect(testObject.getterAndSetterValue).to.be.equal(value);
      });

      it('calling with not matching value should call the original function', () => {
        // Arrange
        mole.setup(_ => _.oneArgumentsFunction(1)).callback(() => { });

        var arg = {};
        testObject.onOneArgumentsFunctionCalled = (_arg) => {
          actualArg = arg;
        };

        // Act
        testObject.oneArgumentsFunction(arg);
      });

      it('calling setter with not matching value should call the original setter', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => { });

        var arg = {};
        testObject.onSetterCalled = (_arg) => {
          actualArg = arg;
        };

        // Act
        testObject.setter = arg;
      });

    });

    describe('returns', () => {

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call the original getter', () => {
        // Arrange
        mole.setup(_ => _.getter).returns(111);

        testObject.onGetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.getter;
      });

      it('should not call the original getter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).returns(111);

        testObject.onGetterOfGetterAndSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.getterAndSetter;
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should return the value', () => {
        // Arrange
        var returnValue = {};
        mole.setup(_ => _.returning1Function()).returns(returnValue);

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should return the value for getter', () => {
        // Arrange
        var returnValue = {};
        mole.setup(_ => _.getter).returns(returnValue);

        // Act
        var result = testObject.getter;

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should return the value for getter and setter', () => {
        // Arrange
        var returnValue = {};
        mole.setup(_ => _.getterAndSetter).returns(returnValue);

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should return the last returns value', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        mole.setup(_ => _.returning1Function()).returns(returnValue1);
        mole.setup(_ => _.returning1Function()).returns(returnValue2);
        mole.setup(_ => _.returning1Function()).returns(returnValue3);
        mole.setup(_ => _.returning1Function()).returns(returnValue4);

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).returns(4);

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });

      it('setting getter should not affect setter', () => {
        // Arrange
        var returnValue = {};
        mole.setup(_ => _.getterAndSetter).returns(returnValue);

        var valueToSet = {};

        // Act
        testObject.getterAndSetter = valueToSet;

        // Assert
        expect(testObject.getterAndSetterValue).to.be.equal(valueToSet);
      });

      it('calling with not matching argument should return the original', () => {
        // Arrange
        var returnValue = {};
        mole.setup(_ => _.oneArgumentsFunction(1)).returns(returnValue);

        // Act
        var result = testObject.oneArgumentsFunction(2);

        // Assert
        expect(result).to.not.be.equal(returnValue);
      });

    });

    describe('returnsInOrder', () => {

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns([111]);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should return the values', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        mole.setup(_ => _.returning1Function()).returnsInOrder([returnValue1, returnValue2, returnValue3]);

        // Act
        var result1 = testObject.returning1Function();
        var result2 = testObject.returning1Function();
        var result3 = testObject.returning1Function();
        var result4 = testObject.returning1Function();

        // Assert
        expect(result1).to.not.be.equal(returnValue1);
        expect(result2).to.not.be.equal(returnValue2);
        expect(result3).to.not.be.equal(returnValue3);
        expect(result4).to.be.undefined;
      });

      it('should return the last returns values', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        mole.setup(_ => _.returning1Function()).returns(returnValue1);
        mole.setup(_ => _.returning1Function()).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        mole.setup(_ => _.returning1Function()).returnsInOrder([returnValue5, returnValue6, returnValue7]);

        // Act
        var result1 = testObject.returning1Function();
        var result2 = testObject.returning1Function();
        var result3 = testObject.returning1Function();
        var result4 = testObject.returning1Function();

        // Assert
        expect(result1).to.not.be.equal(returnValue5);
        expect(result2).to.not.be.equal(returnValue6);
        expect(result3).to.not.be.equal(returnValue7);
        expect(result4).to.be.undefined;
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([4]);

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });

      it('should return the last returns values for getter', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        mole.setup(_ => _.getter).returns(returnValue1);
        mole.setup(_ => _.getter).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        mole.setup(_ => _.getter).returnsInOrder([returnValue5, returnValue6, returnValue7]);

        // Act
        var result1 = testObject.getter;
        var result2 = testObject.getter;
        var result3 = testObject.getter;
        var result4 = testObject.getter;

        // Assert
        expect(result1).to.not.be.equal(returnValue5);
        expect(result2).to.not.be.equal(returnValue6);
        expect(result3).to.not.be.equal(returnValue7);
        expect(result4).to.be.undefined;
      });

    });

    describe('lazyReturns', () => {

      it('should not call returnFunction if function is not called', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should call returnFunction when function is called', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.noArgumentsFunction();
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.oneArgumentsFunction(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .lazyReturns((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
            actualArg2 = _arg2;
            actualArg3 = _arg3;
          });

        // Act
        testObject.manyArgumentsFunction(arg1, arg2, arg3);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should return the returnFunction return value', () => {
        // Arrange
        var returnValue = {};

        mole.setup(_ => _.returning1Function()).lazyReturns(() => {
          return returnValue;
        });

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should return the last returnFunction return value', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        mole.setup(_ => _.returning1Function())
          .lazyReturns(() => { return returnValue1; })
          .lazyReturns(() => { return returnValue2; })
          .lazyReturns(() => { return returnValue3; })
          .lazyReturns(() => { return returnValue4; });

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => 4);

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });

      it('should return the last returnFunction return of getter of getter and setter', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        mole.setup(_ => _.getterAndSetter)
          .lazyReturns(() => { return returnValue1; })
          .lazyReturns(() => { return returnValue2; })
          .lazyReturns(() => { return returnValue3; })
          .lazyReturns(() => { return returnValue4; });

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

    });

    describe('lazyReturnsInOrder', () => {

      it('should not call returnFunction if function is not called', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        }]);
      });

      it('should call returnFunction when function is called', () => {
        // Arrange
        var functionThatWasCalled = [];
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([
          () => functionThatWasCalled.push(1),
          () => functionThatWasCalled.push(2),
          () => functionThatWasCalled.push(3)]);

        // Act
        testObject.noArgumentsFunction();
        testObject.noArgumentsFunction();
        testObject.noArgumentsFunction();
        testObject.noArgumentsFunction();

        // Assert
        expect(functionThatWasCalled.length).to.be.equal(3);
        expect(functionThatWasCalled[0]).to.be.equal(1);
        expect(functionThatWasCalled[1]).to.be.equal(2);
        expect(functionThatWasCalled[2]).to.be.equal(3);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.noArgumentsFunction();
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturnsInOrder([(_arg1) => {
          actualArg1 = _arg1;
        }, (_arg2) => {
          actualArg2 = _arg2;
        }]);

        // Act
        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg11 = 1;
        var arg12 = 2;
        var arg13 = 3;
        var arg21 = 4;
        var arg22 = 5;
        var arg23 = 6;

        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .lazyReturnsInOrder([(_arg11, _arg12, _arg13) => {
            actualArg11 = _arg11;
            actualArg12 = _arg12;
            actualArg13 = _arg13;
          }, (_arg21, _arg22, _arg23) => {
            // Assert
            actualArg21 = _arg21;
            actualArg22 = _arg22;
            actualArg23 = _arg23;
          }]);

        // Act
        testObject.manyArgumentsFunction(arg11, arg12, arg13);
        testObject.manyArgumentsFunction(arg21, arg22, arg23);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();
      });

      it('should return the returnFunction return values', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};

        mole.setup(_ => _.returning1Function()).lazyReturnsInOrder([
          () => returnValue1,
          () => returnValue2,
          () => returnValue3
        ]);

        // Act
        var result1 = testObject.returning1Function();
        var result2 = testObject.returning1Function();
        var result3 = testObject.returning1Function();
        var result4 = testObject.returning1Function();

        // Assert
        expect(result1).to.be.equal(returnValue1);
        expect(result2).to.be.equal(returnValue2);
        expect(result3).to.be.equal(returnValue3);
        expect(result4).to.be.undefined;
      });

      it('should return the last returnFunction return values', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        mole.setup(_ => _.returning1Function())
          .lazyReturns(() => { return returnValue1; })
          .lazyReturns(() => { return returnValue2; })
          .lazyReturnsInOrder([() => returnValue3, () => returnValue4])
          .lazyReturnsInOrder([() => returnValue5, () => returnValue6, () => returnValue7]);

        // Act
        var result1 = testObject.returning1Function();
        var result2 = testObject.returning1Function();
        var result3 = testObject.returning1Function();
        var result4 = testObject.returning1Function();

        // Assert
        expect(result1).to.not.be.equal(returnValue5);
        expect(result2).to.not.be.equal(returnValue6);
        expect(result3).to.not.be.equal(returnValue7);
        expect(result4).to.be.undefined;
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => 4]);

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });

      it('should return the last returnFunction return values of getter of getter and setter', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        mole.setup(_ => _.getterAndSetter)
          .lazyReturns(() => { return returnValue1; })
          .lazyReturns(() => { return returnValue2; })
          .lazyReturnsInOrder([() => returnValue3, () => returnValue4])
          .lazyReturnsInOrder([() => returnValue5, () => returnValue6, () => returnValue7]);

        // Act
        var result1 = testObject.getterAndSetter;
        var result2 = testObject.getterAndSetter;
        var result3 = testObject.getterAndSetter;
        var result4 = testObject.getterAndSetter;

        // Assert
        expect(result1).to.not.be.equal(returnValue5);
        expect(result2).to.not.be.equal(returnValue6);
        expect(result3).to.not.be.equal(returnValue7);
        expect(result4).to.be.undefined;
      });

    });

    describe('throws', () => {

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should throw the error', () => {
        // Arrange
        var thrownError = {};
        mole.setup(_ => _.returning1Function()).throws(thrownError);

        // Act
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }
      });

      it('should throw the last error', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.returning1Function())
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.returning1Function();
        } catch (error) {
          expect(actualError).to.be.equal(thrownError4);
        }
      });

      it('should throw the last error for getter', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.getter)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.getter;
        } catch (error) {
          expect(actualError).to.be.equal(thrownError4);
        }
      });

      it('should throw the last error for setter', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.setter = 1)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.setter = 1;
        } catch (error) {
          expect(actualError).to.be.equal(thrownError4);
        }
      });

      it('should throw the last error for getter of getter and setter', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.getterAndSetter)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.getterAndSetter;
        } catch (error) {
          expect(actualError).to.be.equal(thrownError4);
        }
      });

      it('should throw the last error for setter of getter and setter', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.getterAndSetter = 1)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.getterAndSetter = 1;
        } catch (error) {
          expect(actualError).to.be.equal(thrownError4);
        }
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).throws('error');

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });

      it('setting getter should not affect setter', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.getterAndSetter)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.getterAndSetter = 1;
        } catch (e) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('setting setter should not affect getter', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setup(_ => _.getterAndSetter = 1)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.getterAndSetter;
        } catch (e) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('calling setter with not matching argument should not throw', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).throws({});

        // Act
        try {
          testObject.setter = 2;
        } catch (e) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('calling setter of getter and setter with not matching argument should not throw', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).throws({});

        // Act
        try {
          testObject.getterAndSetter = 2;
        } catch (e) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('calling function with not matching argument should not throw', () => {
        // Arrange
        mole.setup(_ => _.oneArgumentsFunction(1)).throws({});

        // Act
        try {
          testObject.oneArgumentsFunction(2);
        } catch (e) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

    });

    describe('lazyThrows', () => {

      it('should not call returnErrorFunction if function is not called', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should call returnErrorFunction when function is called', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyThrows((_arg) => {
          actualArg = _arg;
        });

        // Act
        try {
          testObject.oneArgumentsFunction(arg);
        } catch (e) {
        }
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .lazyThrows((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
            actualArg2 = _arg2;
            actualArg3 = _arg3;
          });

        // Act
        try {
          testObject.manyArgumentsFunction(arg1, arg2, arg3);
        } catch (e) {
        }
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should not call lazyThrows on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }
      });

      it('should throw the returnErrorFunction error', () => {
        // Arrange
        var error = {};

        mole.setup(_ => _.returning1Function()).lazyThrows(() => {
          return error;
        });

        // Act
        try {
          testObject.returning1Function();
        } catch (actualError) {
          expect(actualError).to.be.equal(error);
        }
      });

      it('should throw the last returnErrorFunction error', () => {
        // Arrange
        var error1 = {};
        var error2 = {};
        var error3 = {};
        var error4 = {};

        mole.setup(_ => _.returning1Function())
          .lazyThrows(() => { return error1; })
          .lazyThrows(() => { return error2; })
          .lazyThrows(() => { return error3; })
          .lazyThrows(() => { return error4; });

        // Act
        try {
          testObject.returning1Function();
        } catch (actualError) {
          expect(actualError).to.be.equal(error4);
        }
      });

      it('should not affect verify', () => {
        // Act
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => 4);

        // Assert
        expect(mole.verify(_ => _.noArgumentsFunction(), Times.exact(0))).to.be.true;
      });


    });

    describe('mix', () => {

      it('should throw error if configured after return', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setup(_ => _.returning1Function())
          .returns(returnValue)
          .throws(thrownError);

        // Act
        try {
          testObject.returning1Function();
        } catch (error) {
          expect(actualError).to.be.equal(thrownError);
        }
      });

      it('should return value if configured after throw', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setup(_ => _.returning1Function())
          .throws(thrownError)
          .returns(returnValue);

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should call all the callbacks and the lazy returns but return last configured one', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setup(_ => _.returning1Function())
          .throws(thrownError)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 1;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 2;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 3;
          })
          .callback(() => assert.ok(true, 'should call callback'))
          .returns(returnValue);

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should call all the callbacks and the lazy returns but return last configured one 2', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setup(_ => _.returning1Function())
          .throws(thrownError)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 1;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 2;
          })
          .returns(3)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return returnValue;
          })
          .callback(() => assert.ok(true, 'should call callback'));

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should call all the callbacks and the lazy returns but throw last configured error', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setup(_ => _.returning1Function())
          .throws('asdasd')
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 1;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 2;
          })
          .returns(returnValue)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 3;
          })
          .throws(thrownError)
          .callback(() => assert.ok(true, 'should call callback'));

        // Act
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }
      });

      it('should not affect the verify', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        // Act
        mole.setup(_ => _.returning1Function())
          .throws('asdasd')
          .lazyReturns(() => 1)
          .lazyReturns(() => 2)
          .lazyReturns(() => 3)
          .throws(thrownError)
          .returns(returnValue)
          .callback(() => { });

        // Assert
        assert.ok(mole.verify(_ => _.returning1Function(), Times.exact(0)), 'should be called once');
      });

      it('should call only the matching set', () => {
        // Arrange
        var returnValue = {};

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          });

        mole.setup(_ => _.oneArgumentsFunction('aaa'))
          .throws('error')
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          })
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          });

        mole.setup(_ => _.oneArgumentsFunction('bbb'))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns(returnValue);

        // Act
        var result = testObject.oneArgumentsFunction('bbb');

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('if both setups match should call both', () => {
        // Arrange
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        mole.setup(_ => _.oneArgumentsFunction(1))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        // Act
        testObject.oneArgumentsFunction(1);
      });

      it('if both setups match should return from the last', () => {
        // Arrange
        var returnValue = {};

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => 1)
          .returns(() => 2);

        mole.setup(_ => _.oneArgumentsFunction(1))
          .lazyReturns(() => 3)
          .returns(returnValue);

        // Act
        var result = testObject.oneArgumentsFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('if both setups match should return from the last 2', () => {
        // Arrange
        var returnValue = {};

        mole.setup(_ => _.oneArgumentsFunction(1))
          .lazyReturns(() => 1)
          .returns(() => 2);

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => 3)
          .returns(returnValue);

        // Act
        var result = testObject.oneArgumentsFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('if both setups match should throw from the last', () => {
        // Arrange
        var thrownError = {};

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => 1)
          .throws('error')
          .returns(() => 2);

        mole.setup(_ => _.oneArgumentsFunction(1))
          .lazyReturns(() => 3)
          .throws(thrownError);

        // Act
        try {
          testObject.oneArgumentsFunction(1);
        } catch (error) {
          expect(actualError).to.be.equal(thrownError);
        }
      });

      it('if both setups match should throw from the last 2', () => {
        // Arrange
        var thrownError = {};

        mole.setup(_ => _.oneArgumentsFunction(1))
          .lazyReturns(() => 1)
          .throws('error')
          .returns(() => 2);

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => 3)
          .throws(thrownError);

        // Act
        try {
          testObject.oneArgumentsFunction(1);
        } catch (error) {
          expect(actualError).to.be.equal(thrownError);
        }
      });

      it('setup for one object should not affect other', () => {
        // Arrange
        var testObject1 = new TestObject();
        var testObject2 = new TestObject();

        var mole1 = new Mole(testObject1);
        var mole2 = new Mole(testObject2);

        var arg1 = 10;
        var returnsValue = 1;
        mole1.setup(_ => _.getter).returns(returnsValue);
        mole1.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback((_arg) => {
          actualArg = _arg;
        });

        var arg2 = 20;
        testObject2.onOneArgumentsFunctionCalled = (_arg) => {
          actualArg2 = _arg;
        };

        testObject1.onGetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject2.onGetterCalled = () => {
          // Assert
          expect(numberOfTimesCalled).to.be.equal(1);
        };

        var value = {};
        testObject2.getterValue = value;
        // Act
        var result1 = testObject1.getter;
        var result2 = testObject2.getter;
        testObject1.oneArgumentsFunction(arg1);
        testObject2.oneArgumentsFunction(arg2);

        // Assert
        expect(result1).to.be.equal(returnsValue);
        expect(result2).to.be.equal(value);
      });

    });

  });

  describe('setupPrivate', () => {

    describe('callback', () => {

      it('should not call callback if function is not called', () => {
        // Act
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if getter is not called', () => {
        // Act
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if setter is not called', () => {
        // Act
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if getter of geter&setter is not called', () => {
        // Act
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should not call callback if setter of geter&setter is not called', () => {
        // Act
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should call callback when function is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.callPrivateFunction(null);
      });

      it('should call callback when getter is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.callPrivateGetter();
      });

      it('should call callback when setter is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.callPrivateSetter(1);
      });

      it('should not call callback when setter is called with wrong parameter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });

        // Act
        testObject.callPrivateSetter(2);
      });

      it('should call callback when getter of getter&setter is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.callPrivateGetterOfGetterAndSetter();
      });

      it('should call callback when setter of getter&setter is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(1);
      });

      it('should not call callback when setter of getter&setter is called with wrong parameter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(2);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        testObject.onPrivateFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateFunction(null);
      });

      it('should not call the original getter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).callback(() => { });

        testObject.onPrivateGetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateGetter();
      });

      it('should not call the original setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => { });

        testObject.onPrivateSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateSetter(1);
      });

      it('should call the original setter if called with other argument', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => { });

        testObject.onPrivateSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(1);
        };

        // Act
        testObject.callPrivateSetter(2);
      });

      it('should not call the original getter of getter and setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(() => { });

        testObject.onPrivateGetterOfGetterAndSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateGetterOfGetterAndSetter();
      });

      it('should not call the original setter of getter and setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => { });

        testObject.onPrivateSetterOfGetterAndSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(1);
      });

      it('should call the original setter of getter and setter if called with other argument', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => { });

        testObject.onPrivateSetterOfGetterAndSetterCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(1);
        };

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(2);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.callPrivateFunction(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 2;

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 2)
          .callback((_arg1) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateFunction(arg1);
      });

      it('should pass the same parameters to setter', () => {
        // Arrange
        var arg1 = 2;

        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 2)
          .callback((_arg1) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateSetter(arg1);
      });

      it('should pass the same parameters to setter of getter&setter', () => {
        // Arrange
        var arg1 = 2;

        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 2)
          .callback((_arg1) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(arg1);
      });

      it('should not call if not matching', () => {
        // Arrange
        var arg = 'some text';

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });

        // Act
        testObject.callPrivateFunction(arg);
      });

      it('should not call if not matching 2', () => {
        // Arrange
        var arg1 = 3;

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 2)
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          });

        // Act
        testObject.callPrivateFunction(arg1);
      });

      it('should not call if not matching 3', () => {
        // Arrange
        var arg1 = 3;

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME)
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          });

        // Act
        testObject.callPrivateFunction(undefined);
      });

      it('should not call setter if not matching', () => {
        // Arrange
        var arg = 'some text';

        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, It.isAny(Number)).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });

        // Act
        testObject.callPrivateSetter(arg);
      });

      it('should not call setter of getter&setter if not matching', () => {
        // Arrange
        var arg = 'some text';

        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number)).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(arg);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(null);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(null);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should not return the callback return value', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => {
          return {};
        });

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.undefined;
      });

      it('should call all the callbacks when function is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        }).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		}).callback(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
      		});

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should pass the same parameters to all the callbacks when function is called', () => {
        // Arrange
        var arg = 12;

        var checkArgument = (_arg) => {
          actualArg = _arg;
        };

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .callback(checkArgument)
          .callback(checkArgument)
          .callback(checkArgument)
          .callback(checkArgument);

        // Act
        testObject.callPrivateFunction(arg);
      });

    });

    describe('returns', () => {


      it('returns - should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        testObject.onPrivateFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateFunction(1);
      });

      it('returns - should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('returns - should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('returns - should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('returns - should return the value', () => {
        // Arrange
        var returnValue = {};
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('returns - should return the last returns value', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue1);
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue2);
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue3);
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue4);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

      it('returns - should return the last getter value', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).returns(returnValue1);
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).returns(returnValue2);
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).returns(returnValue3);
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).returns(returnValue4);

        // Act
        var result = testObject.callPrivateGetter();

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

      it('returns - should return the last getter of getter and setter value', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue1);
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue2);
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue3);
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue4);

        // Act
        var result = testObject.callPrivateGetterOfGetterAndSetter();

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

    });

    describe('lazyReturns', () => {

      it('should not call returnFunction if function is not called', () => {
        // Act
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
          expect(numberOfTimesCalled).to.be.equal(0);
        });
      });

      it('should call returnFunction when function is called', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
          expect(numberOfTimesCalled).to.be.equal(1);
        });

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        testObject.onPrivateFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.callPrivateFunction(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, arg1)
          .lazyReturns((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateFunction(arg1);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);
      });

      it('should return the returnFunction return value', () => {
        // Arrange
        var returnValue = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
          return returnValue;
        });

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should return the last returnFunction return value', () => {
        // Arrange
        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => { return returnValue1; })
          .lazyReturns(() => { return returnValue2; })
          .lazyReturns(() => { return returnValue3; })
          .lazyReturns(() => { return returnValue4; });

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue4);
      });

      it('setup getter should not affect setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME)
          .lazyReturns(() => { return 1; });

        var value = {};

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(value);

        // Assert
        expect(testObject.privateGetterAndSetterValue).to.be.equal(value);
      });


    });

    describe('throws', () => {

      it('should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        testObject.onNoArgumentsFunctionCalled = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (e) {
        }
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (e) {
        }
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (e) {
        }
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = () => {
          expect(numberOfTimesCalled).to.be.equal(0);
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (e) {
        }
      });

      it('should throw the error', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError);

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }
      });

      it('should throw the error for getter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).throws(thrownError);

        // Act
        try {
          testObject.callPrivateGetter();
        } catch (error) {
          actualError = error;
        }
      });

      it('should throw the error for setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        // Act
        try {
          testObject.callPrivateSetter(1);
        } catch (error) {
          actualError = error;
        }
      });

      it('should not throw the error for setter if arguments dont match', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        // Act
        try {
          testObject.callPrivateSetter(2);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('should throw the error for getter of getter&setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        // Act
        try {
          testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
          actualError = error;
        }
      });

      it('should throw the error for setter of getter&setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        // Act
        try {
          testObject.callPrivateSetterOfGetterAndSetter(1);
        } catch (error) {
          actualError = error;
        }
      });

      it('should not throw the error for setter of getter&setter if arguments dont match', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        // Act
        try {
          testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('setup getter should not throw on setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        // Act
        try {
          testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('setup setter should not throw on getter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        // Act
        try {
          testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('should throw the last error', () => {
        // Arrange
        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws(thrownError1)
          .throws(thrownError2)
          .throws(thrownError3)
          .throws(thrownError4);

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          expect(actualError).to.be.equal(thrownError4);
        }
      });

    });

    describe('mix', () => {

      it('should throw error if configured after return', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .returns(returnValue)
          .throws(thrownError);

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          expect(actualError).to.be.equal(thrownError);
        }
      });

      it('should return value if configured after throw', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws(thrownError)
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should call all the callbacks and the lazy returns but return last configured one', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws(thrownError)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 1;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 2;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 3;
          })
          .callback(() => assert.ok(true, 'should call callback'))
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should call all the callbacks and the lazy returns but return last configured one 2', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws(thrownError)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 1;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 2;
          })
          .returns(3)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return returnValue;
          })
          .callback(() => assert.ok(true, 'should call callback'));

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('should call all the callbacks and the lazy returns but throw last configured error', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws('asdasd')
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 1;
          })
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 2;
          })
          .returns(returnValue)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
            return 3;
          })
          .throws(thrownError)
          .callback(() => assert.ok(true, 'should call callback'));

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }
      });

      it('should call only the matching set', () => {
        // Arrange
        var returnValue = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          });

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 'aaa')
          .throws('error')
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          })
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(0);
          });

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 'bbb')
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction('bbb');

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('if both setups match should call both', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        // Act
        testObject.callPrivateFunction(1);
      });

      it('if both setups match should call both for setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, It.isAny(Number))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        // Act
        testObject.callPrivateSetter(1);
      });

      it('if both setups match should call both for setter of getter and setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number))
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1)
          .lazyReturns(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          })
          .returns('return value')
          .callback(() => {
            expect(numberOfTimesCalled).to.be.equal(1);
          });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(1);
      });

      it('if both setups match should return from the last', () => {
        // Arrange
        var returnValue = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => 1)
          .returns(() => 2);

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => 3)
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('if both setups match should return from the last 2', () => {
        // Arrange
        var returnValue = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => 1)
          .returns(() => 2);

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => 3)
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
      });

      it('if both setups match should throw from the last', () => {
        // Arrange
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => 1)
          .throws('error')
          .returns(() => 2);

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => 3)
          .throws(thrownError);

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          expect(actualError).to.be.equal(thrownError);
        }
      });

      it('if both setups match should throw from the last 2', () => {
        // Arrange
        var thrownError = {};

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => 1)
          .throws('error')
          .returns(() => 2);

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => 3)
          .throws(thrownError);

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          expect(actualError).to.be.equal(thrownError);
        }
      });

    });

  });

  describe('isStrict', () => {

    describe('true', () => {

      it('isStrict - true - no setup should throw error', () => {
        // Arrangemole.isStrict = true;

        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - no setup for getter should throw error', () => {
        // Arrangemole.isStrict = true;

        try {
          // Act
          testObject.getter;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - no setup for setter should throw error', () => {
        // Arrangemole.isStrict = true;

        try {
          // Act
          testObject.setter = 1;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - no setup for getter of getter and setter should throw error', () => {
        // Arrangemole.isStrict = true;

        try {
          // Act
          testObject.getterAndSetter;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - no setup for setter of getter and setter should throw error', () => {
        // Arrangemole.isStrict = true;

        try {
          // Act
          testObject.getterAndSetter = 1;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - has callback setup should call the callback and not throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          assert.ok(true, 'should call the setup');
        });

        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - getter has callback setup should call the callback and not throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.getter).callback(() => {
          assert.ok(true, 'should call the setup');
        });

        try {
          // Act
          testObject.getter;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - setter has callback setup should call the callback and not throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.setter = 1).callback(() => {
          assert.ok(true, 'should call the setup');
        });

        try {
          // Act
          testObject.setter = 1;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - getter of getter&setter has callback setup should call the callback and not throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.getterAndSetter).callback(() => {
          assert.ok(true, 'should call the setup');
        });

        try {
          // Act
          testObject.getterAndSetter;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - setter of getter&setter has callback setup should call the callback and not throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          assert.ok(true, 'should call the setup');
        });

        try {
          // Act
          testObject.getterAndSetter = 1;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - has callback setup  for other argument should throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.oneArgumentsFunction(1)).callback(() => { });

        try {
          // Act
          testObject.oneArgumentsFunction(2);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - setter has callback setup for other argument should throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.setter = 1).callback(() => { });

        try {
          // Act
          testObject.setter = 2;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - setter of getter&setter has callback setup for other argument should throw error', () => {
        // Arrangemole.isStrict = true;

        mole.setup(_ => _.getterAndSetter = 1).callback(() => { });

        try {
          // Act
          testObject.getterAndSetter = 2;
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(1);
        }
      });

      it('isStrict - true - has lazyReturns setup should call the lazyReturns and not throw error', () => {
        // Arrangemole.isStrict = true;

        var returnValue = {};
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          assert.ok(true, 'should call the lazyReturns');
          return returnValue;
        });

        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - has returns setup should return the returnValue and not throw error', () => {
        // Arrangemole.isStrict = true;

        var returnValue = {};
        mole.setup(_ => _.noArgumentsFunction()).returns(returnValue);

        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - true - has throws setup should throw the thrownError', () => {
        // Arrangemole.isStrict = true;

        var thrownError = {};
        mole.setup(_ => _.noArgumentsFunction()).throws(thrownError);

        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          // Assert
          expect(error, thrownError, 'should throw the thrown error');
        }
      });

    });

    describe('false', () => {

      it('isStrict - false - no setup should not throw error', () => {
        // Arrangemole.isStrict = false;

        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - false - has callbeck setup should call the callback and not throw error', () => {
        // Arrangemole.isStrict = false;

        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          assert.ok(true, 'should call the setup');
        });

        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - false - has lazyReturns setup should call the lazyReturns and not throw error', () => {
        // Arrangemole.isStrict = false;

        var returnValue = {};
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          assert.ok(true, 'should call the lazyReturns');
          return returnValue;
        });

        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - false - has returns setup should return the returnValue and not throw error', () => {
        // Arrangemole.isStrict = false;

        var returnValue = {};
        mole.setup(_ => _.noArgumentsFunction()).returns(returnValue);

        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          expect(numberOfTimesThrown).to.be.equal(0);
        }
      });

      it('isStrict - false - has throws setup should throw the thrownError', () => {
        // Arrangemole.isStrict = false;

        var thrownError = {};
        mole.setup(_ => _.noArgumentsFunction()).throws(thrownError);

        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          // Assert
          expect(error, thrownError, 'should throw the thrown error');
        }
      });

    });

  });

  describe('staticFunction', () => {

    it('Override static function', () => {
      // Arrange
      var mole = new Mole<any>(TestObject);

      // Act
      mole.setup(_ => { TestObject.staticFunction(); }).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      TestObject.staticFunction();
    });

  });

  describe('setup', () => {

    it('inheritence - callback on sons function should call callback', () => {
      // Arrange
      var testObjectSon = new TestObjectSon();
      var mole = new Mole<TestObjectSon>(testObjectSon);

      // Act
      mole.setup(_ => _.noArgumentsFunction()).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      testObjectSon.noArgumentsFunction();
    });

  });

  describe('dispose', () => {

    it('before dispose should not call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onNoArgumentsFunctionCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(0);
      };

      mole.setup(_ => _.noArgumentsFunction()).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      // Act
      testObject.noArgumentsFunction();
    });

    it('before dispose should not call the original getter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onGetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(0);
      };

      mole.setup(_ => _.getter).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      // Act
      testObject.getter;
    });

    it('before dispose should not call the original setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onSetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(0);
      };

      mole.setup(_ => _.setter = 1).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      // Act
      testObject.setter = 1;
    });

    it('before dispose should not call the original getter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onGetterOfGetterAndSetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(0);
      };

      mole.setup(_ => _.getterAndSetter).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      // Act
      testObject.getterAndSetter;
    });

    it('before dispose should not call the original setter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onSetterOfGetterAndSetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(0);
      };

      mole.setup(_ => _.getterAndSetter = 1).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      // Act
      testObject.getterAndSetter = 1;
    });

    it('should call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onNoArgumentsFunctionCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(1);
      };

      mole.setup(_ => _.noArgumentsFunction()).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      // Act
      mole.dispose();
      testObject.noArgumentsFunction();
    });

    it('should call the original getter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onGetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(1);
      };

      mole.setup(_ => _.getter).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      // Act
      mole.dispose();
      testObject.getter;
    });

    it('should call the original setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onSetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(1);
      };

      mole.setup(_ => _.setter = 1).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      // Act
      mole.dispose();
      testObject.setter = 1;
    });

    it('should call the original getter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onGetterOfGetterAndSetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(1);
      };

      mole.setup(_ => _.getterAndSetter).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      // Act
      mole.dispose();
      testObject.getterAndSetter;
    });

    it('should call the original setter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      testObject.onSetterOfGetterAndSetterCalled = () => {
        expect(numberOfTimesCalled).to.be.equal(1);
      };

      mole.setup(_ => _.getterAndSetter = 1).callback(() => {
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      // Act
      mole.dispose();
      testObject.getterAndSetter = 1;
    });

  });

  describe('findMoleByObject', () => {

    it('if null should return null', () => {
      // Act
      var result = Mole.findMoleByObject(null);

      // Assert
      expect(result).to.be.null;
    });

    it('if undefined should return null', () => {
      // Act
      var result = Mole.findMoleByObject(undefined);

      // Assert
      expect(result).to.be.null;
    });

    it('object without mole should return null', () => {
      // Act
      var result = Mole.findMoleByObject({});

      // Assert
      expect(result).to.be.null;
    });

    it('object with mole should return the mole', () => {
      // Act
      var result = Mole.findMoleByObject(testObject);

      // Assert
      expect(result).to.be.equal(mole);
    });

    it('objects with moles should return correct moles', () => {
      // Arrange
      var obj1 = {};
      var obj2 = {};

      var mole1 = new Mole(obj1);
      var mole2 = new Mole(obj2);

      // Act
      var result1 = Mole.findMoleByObject(obj1);
      var result2 = Mole.findMoleByObject(obj2);
      var result3 = Mole.findMoleByObject(testObject);

      // Assert
      expect(result1).to.be.equal(mole1);
      expect(result2).to.be.equal(mole2);
      expect(result3).to.be.equal(mole);
    });

    it('after dispose on mole should not return the mole for the object', () => {
      // Arrange
      var obj1 = {};
      var obj2 = {};
      var obj3 = {};

      var mole1 = new Mole(obj1);
      var mole2 = new Mole(obj2);

      // Act
      mole2.dispose();
      var mole3 = new Mole(obj3);
      var result1 = Mole.findMoleByObject(obj1);
      var result2 = Mole.findMoleByObject(obj2);
      var result3 = Mole.findMoleByObject(testObject);
      var result4 = Mole.findMoleByObject(obj3);

      // Assert
      expect(result1).to.be.equal(mole1);
      expect(result2).to.be.null;
      expect(result3).to.be.equal(mole);
      expect(result4).to.be.equal(mole3);
    });

  });

  describe('moleReturnValue', () => {

    it('should be false', () => {
      // Assert
      expect(mole.moleReturnValue).to.be.false;
    });

    it('should not create mole of the return value by default', () => {
      // Act
      var result: TestObject = testObject.complexReturnFunction();
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole).to.be.null;
    });

    it('set to false should not create mole of the return value', () => {
      // Arrange
      mole.moleReturnValue = false;

      // Act
      var result: TestObject = testObject.complexReturnFunction();
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.false;
      expect(mole).to.be.null;
    });

    it('set to true should create mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      // Act
      var result: TestObject = testObject.complexReturnFunction();
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(mole).to.not.be.null;
    });

    it('set to true should create new mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexReturnFunction();
      var mole = Mole.findMoleByObject(returnValue);
      mole.setup(_ => _.returning1Function()).returns(2);

      // Act
      var result1 = testObject.returning1Function();
      var result2 = returnValue.returning1Function();

      // Assert
      expect(result1).to.be.equal(1);
      expect(result2).to.be.equal(2);
    });

    it('set to true should create mole for the return value return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      // Act
      var result: TestObject = testObject.complexReturnFunction().complexReturnFunction();
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(mole).to.not.be.null;
    });

    it('set to true should create new mole for the return value return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexReturnFunction().complexReturnFunction();
      var mole = Mole.findMoleByObject(returnValue);
      mole.setup(_ => _.returning1Function()).returns(2);

      // Act
      var result1 = testObject.returning1Function();
      var result2 = returnValue.returning1Function();

      // Assert
      expect(result1).to.be.equal(1);
      expect(result2).to.be.equal(2);
    });

    it('set to false should not create mole of the return value', () => {
      // Arrange
      mole.moleReturnValue = false;

      // Act
      var result: TestObject = testObject.complexGetterFunction;
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.false;
      expect(mole).to.be.null;
    });

    it('set to true should create mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      // Act
      var result: TestObject = testObject.complexGetterFunction;
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(mole).to.not.be.null;
    });

    it('set to true should create new mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexGetterFunction;
      var mole = Mole.findMoleByObject(returnValue);
      mole.setup(_ => _.returning1Function()).returns(2);

      // Act
      var result1 = testObject.returning1Function();
      var result2 = returnValue.returning1Function();

      // Assert
      expect(result1).to.be.equal(1);
      expect(result2).to.be.equal(2);
    });

    it('set to true should create mole for the return value return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      // Act
      var result: TestObject = testObject.complexGetterFunction.complexGetterFunction;
      var mole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(mole).to.not.be.null;
    });

    it('set to true should create new mole for the return value return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexGetterFunction.complexGetterFunction;
      var mole = Mole.findMoleByObject(returnValue);
      mole.setup(_ => _.returning1Function()).returns(2);

      // Act
      var result1 = testObject.returning1Function();
      var result2 = returnValue.returning1Function();

      // Assert
      expect(result1).to.be.equal(1);
      expect(result2).to.be.equal(2);
    });

  });

});
