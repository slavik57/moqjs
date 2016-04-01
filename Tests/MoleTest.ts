import { expect } from 'chai';
import { TestObject } from './testsCommon/TestObject';
import { TestObjectSon } from './testsCommon/TestObjectSon';
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
      expect(verifyGetterAndSetterGetter).to.be.true;
      expect(verifyGetterAndSetterSetter).to.be.false;
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
      expect(verifyGetterAndSetterGetter).to.be.false;
      expect(verifyGetterAndSetterSetter).to.be.true;
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
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if getter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getter).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if setter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.setter = 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if getter of getter and setter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getterAndSetter).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if setter of getter and setter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call callback when function is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when getter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getter).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.getter;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when setter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.setter = 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.setter = 1;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when getter of getter and setter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getterAndSetter).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.getterAndSetter;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when setter of getter and setter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.getterAndSetter = 1;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original getter', () => {
        // Arrange
        mole.setup(_ => _.getter).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onGetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.getter;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original setter', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.setter = 1;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original getter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onGetterOfGetterAndSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.getterAndSetter;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original setter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onSetterOfGetterAndSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.getterAndSetter = 1;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.oneArgumentsFunction(arg);

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var actualArg1;
        var actualArg2;
        var actualArg3;
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .callback((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
            actualArg2 = _arg2;
            actualArg3 = _arg3;
          });

        // Act
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
        expect(actualArg2).to.be.equal(arg2);
        expect(actualArg3).to.be.equal(arg3);
      });

      it('should pass the same parameters to setter', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setup(_ => _.setter = It.isAny(Number)).callback((_arg) => {
          actualArg = arg;
        });

        // Act
        testObject.setter = arg;

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass the same parameters to setter of getter and setter', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setup(_ => _.getterAndSetter = It.isAny(Number)).callback((_arg) => {
          actualArg = arg;
        });

        // Act
        testObject.getterAndSetter = arg;

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions 2', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions 3', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          numberOfTimesCalled1++;
        }).callback(() => {
          numberOfTimesCalled2++;
      		}).callback(() => {
          numberOfTimesCalled3++;
      		}).callback(() => {
          numberOfTimesCalled4++;
      		});

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks when function is called for getter', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.getter).callback(() => {
          numberOfTimesCalled1++;
        }).callback(() => {
          numberOfTimesCalled2++;
      		}).callback(() => {
          numberOfTimesCalled3++;
      		}).callback(() => {
          numberOfTimesCalled4++;
      		});

        // Act
        testObject.getter;

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks when function is called for setter', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.setter = 1).callback(() => {
          numberOfTimesCalled1++;
        }).callback(() => {
          numberOfTimesCalled2++;
      		}).callback(() => {
          numberOfTimesCalled3++;
      		}).callback(() => {
          numberOfTimesCalled4++;
      		});

        // Act
        testObject.setter = 1;

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks when function is called for getter of getter and setter', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.getterAndSetter).callback(() => {
          numberOfTimesCalled1++;
        }).callback(() => {
          numberOfTimesCalled2++;
      		}).callback(() => {
          numberOfTimesCalled3++;
      		}).callback(() => {
          numberOfTimesCalled4++;
      		});

        // Act
        testObject.getterAndSetter;

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks when function is called for setter of getter and setter', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          numberOfTimesCalled1++;
        }).callback(() => {
          numberOfTimesCalled2++;
      		}).callback(() => {
          numberOfTimesCalled3++;
      		}).callback(() => {
          numberOfTimesCalled4++;
      		});

        // Act
        testObject.getterAndSetter = 1;

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should pass teh same parameters to all the callbacks when function is called', () => {
        // Arrange
        var arg = 12;

        var actualArg;
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

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass teh same parameters to all the callbacks when function is called 2', () => {
        // Arrange
        var arg1 = 11;
        var arg2 = 12;
        var arg3 = 13;

        var actualArg1;
        var actualArg2;
        var actualArg3;
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

        // Assert
        expect(actualArg1).to.be.equal(arg1);
        expect(actualArg2).to.be.equal(arg2);
        expect(actualArg3).to.be.equal(arg3);
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
        var actualArg;
        testObject.onOneArgumentsFunctionCalled = (_arg) => {
          actualArg = arg;
        };

        // Act
        testObject.oneArgumentsFunction(arg);

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('calling setter with not matching value should call the original setter', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).callback(() => { });

        var arg = {};
        var actualArg;
        testObject.onSetterCalled = (_arg) => {
          actualArg = arg;
        };

        // Act
        testObject.setter = arg;

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

    });

    describe('returns', () => {

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original getter', () => {
        // Arrange
        mole.setup(_ => _.getter).returns(111);

        var numberOfTimesCalled = 0;
        testObject.onGetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.getter;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original getter of getter and setter', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter).returns(111);

        var numberOfTimesCalled = 0;
        testObject.onGetterOfGetterAndSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.getterAndSetter;

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).returns([111]);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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
        expect(result1).to.be.equal(returnValue1);
        expect(result2).to.be.equal(returnValue2);
        expect(result3).to.be.equal(returnValue3);
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
        expect(result1).to.be.equal(returnValue5);
        expect(result2).to.be.equal(returnValue6);
        expect(result3).to.be.equal(returnValue7);
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
        expect(result1).to.be.equal(returnValue5);
        expect(result2).to.be.equal(returnValue6);
        expect(result3).to.be.equal(returnValue7);
        expect(result4).to.be.undefined;
      });

    });

    describe('lazyReturns', () => {

      it('should not call returnFunction if function is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call returnFunction when function is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.oneArgumentsFunction(arg);

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var actualArg1;
        var actualArg2;
        var actualArg3;
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
          .lazyReturns((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
            actualArg2 = _arg2;
            actualArg3 = _arg3;
          });

        // Act
        testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
        expect(actualArg2).to.be.equal(arg2);
        expect(actualArg3).to.be.equal(arg3);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => {
          numberOfTimesCalled++;
        }]);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;

        var actualArg1;
        var actualArg2;
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturnsInOrder([(_arg1) => {
          actualArg1 = _arg1;
        }, (_arg2) => {
          actualArg2 = _arg2;
        }]);

        // Act
        testObject.oneArgumentsFunction(arg1);
        testObject.oneArgumentsFunction(arg2);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
        expect(actualArg2).to.be.equal(arg2);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg11 = 1;
        var arg12 = 2;
        var arg13 = 3;
        var arg21 = 4;
        var arg22 = 5;
        var arg23 = 6;

        var actualArg11;
        var actualArg12;
        var actualArg13;
        var actualArg21;
        var actualArg22;
        var actualArg23;
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

        // Assert
        expect(actualArg11).to.be.equal(arg11);
        expect(actualArg12).to.be.equal(arg12);
        expect(actualArg13).to.be.equal(arg13);
        expect(actualArg21).to.be.equal(arg21);
        expect(actualArg22).to.be.equal(arg22);
        expect(actualArg23).to.be.equal(arg23);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.noArgumentsFunction();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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
        expect(result1).to.be.equal(returnValue5);
        expect(result2).to.be.equal(returnValue6);
        expect(result3).to.be.equal(returnValue7);
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
        expect(result1).to.be.equal(returnValue5);
        expect(result2).to.be.equal(returnValue6);
        expect(result3).to.be.equal(returnValue7);
        expect(result4).to.be.undefined;
      });

    });

    describe('throws', () => {

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should throw the error', () => {
        // Arrange
        var thrownError = {};
        mole.setup(_ => _.returning1Function()).throws(thrownError);

        // Act
        var actualError;
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
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
        var actualError;
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError4);
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
        var actualError;
        try {
          testObject.getter;
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError4);
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
        var actualError;
        try {
          testObject.setter = 1;
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError4);
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
        var actualError;
        try {
          testObject.getterAndSetter;
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError4);
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
        var actualError;
        try {
          testObject.getterAndSetter = 1;
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError4);
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
        var numberOfTimesThrown = 0;
        try {
          testObject.getterAndSetter = 1;
        } catch (e) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
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
        var numberOfTimesThrown = 0;
        try {
          testObject.getterAndSetter;
        } catch (e) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('calling setter with not matching argument should not throw', () => {
        // Arrange
        mole.setup(_ => _.setter = 1).throws({});

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.setter = 2;
        } catch (e) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('calling setter of getter and setter with not matching argument should not throw', () => {
        // Arrange
        mole.setup(_ => _.getterAndSetter = 1).throws({});

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.getterAndSetter = 2;
        } catch (e) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('calling function with not matching argument should not throw', () => {
        // Arrange
        mole.setup(_ => _.oneArgumentsFunction(1)).throws({});

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.oneArgumentsFunction(2);
        } catch (e) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

    });

    describe('lazyThrows', () => {

      it('should not call returnErrorFunction if function is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call returnErrorFunction when function is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => {
          numberOfTimesCalled++;
        });

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyThrows((_arg) => {
          actualArg = _arg;
        });

        // Act
        try {
          testObject.oneArgumentsFunction(arg);
        } catch (e) {
        }

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var actualArg1;
        var actualArg2;
        var actualArg3;
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

        // Assert
        expect(actualArg1).to.be.equal(arg1);
        expect(actualArg2).to.be.equal(arg2);
        expect(actualArg3).to.be.equal(arg3);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.noArgumentsFunction();
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyThrows on other functions', () => {
        // Arrange
        mole.setup(_ => _.noArgumentsFunction()).lazyThrows(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should throw the returnErrorFunction error', () => {
        // Arrange
        var error = {};

        mole.setup(_ => _.returning1Function()).lazyThrows(() => {
          return error;
        });

        // Act
        var actualError;
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(error);
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
        var actualError;
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(error4);
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
        var actualError;
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
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

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.returning1Function())
          .throws(thrownError)
          .lazyReturns(() => {
            numberOfTimesCalled1++;
            return 1;
          })
          .lazyReturns(() => {
            numberOfTimesCalled2++;
            return 2;
          })
          .lazyReturns(() => {
            numberOfTimesCalled3++;
            return 3;
          })
          .callback(() => numberOfTimesCalled4++)
          .returns(returnValue);

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks and the lazy returns but return last configured one 2', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.returning1Function())
          .throws(thrownError)
          .lazyReturns(() => {
            numberOfTimesCalled1++;
            return 1;
          })
          .lazyReturns(() => {
            numberOfTimesCalled2++;
            return 2;
          })
          .returns(3)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
            return returnValue;
          })
          .callback(() => numberOfTimesCalled4++);

        // Act
        var result = testObject.returning1Function();

        // Assert
        expect(result).to.be.equal(returnValue);
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks and the lazy returns but throw last configured error', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.returning1Function())
          .throws('asdasd')
          .lazyReturns(() => {
            numberOfTimesCalled1++;
            return 1;
          })
          .lazyReturns(() => {
            numberOfTimesCalled2++;
            return 2;
          })
          .returns(returnValue)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
            return 3;
          })
          .throws(thrownError)
          .callback(() => numberOfTimesCalled4++);

        // Act
        var actualError;
        try {
          testObject.returning1Function();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
        expect(actualError).to.be.equal(thrownError);
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
        expect(mole.verify(_ => _.returning1Function(), Times.exact(0))).to.be.true;
      });

      it('should call only the matching set', () => {
        // Arrange
        var returnValue = {};

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        var numberOfTimesCalled5 = 0;
        var numberOfTimesCalled6 = 0;
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => {
            numberOfTimesCalled1++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled2++;
          });

        mole.setup(_ => _.oneArgumentsFunction('aaa'))
          .throws('error')
          .lazyReturns(() => {
            numberOfTimesCalled3++;
          })
          .callback(() => {
            numberOfTimesCalled4++;
          });

        mole.setup(_ => _.oneArgumentsFunction('bbb'))
          .lazyReturns(() => {
            numberOfTimesCalled5++;
          })
          .callback(() => {
            numberOfTimesCalled6++;
          })
          .returns(returnValue);

        // Act
        var result = testObject.oneArgumentsFunction('bbb');

        // Assert
        expect(result).to.be.equal(returnValue);
        expect(numberOfTimesCalled1).to.be.equal(0);
        expect(numberOfTimesCalled2).to.be.equal(0);
        expect(numberOfTimesCalled3).to.be.equal(0);
        expect(numberOfTimesCalled4).to.be.equal(0);
        expect(numberOfTimesCalled5).to.be.equal(1);
        expect(numberOfTimesCalled6).to.be.equal(1);
      });

      it('if both setups match should call both', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
          .lazyReturns(() => {
            numberOfTimesCalled1++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled2++;
          });

        mole.setup(_ => _.oneArgumentsFunction(1))
          .lazyReturns(() => {
            numberOfTimesCalled3++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled4++;
          });

        // Act
        testObject.oneArgumentsFunction(1);

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
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
        var actualError;
        try {
          testObject.oneArgumentsFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
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
        var actualError;
        try {
          testObject.oneArgumentsFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
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

        var actualArg1;
        mole1.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback((_arg) => {
          actualArg1 = _arg;
        });

        var arg2 = 20;
        var actualArg2;
        testObject2.onOneArgumentsFunctionCalled = (_arg) => {
          actualArg2 = _arg;
        };

        var numberOfTimesCalled1 = 0;
        testObject1.onGetterCalled = () => {
          numberOfTimesCalled1++;
        };

        var numberOfTimesCalled2 = 0;
        testObject2.onGetterCalled = () => {
          numberOfTimesCalled2++;
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
        expect(numberOfTimesCalled1).to.be.equal(0);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(actualArg1).to.be.equal(arg1);
        expect(actualArg2).to.be.equal(arg2);
      });

    });

  });

  describe('setupPrivate', () => {

    describe('callback', () => {

      it('should not call callback if function is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if getter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if setter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if getter of geter&setter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callback if setter of geter&setter is not called', () => {
        // Act
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call callback when function is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateFunction(null);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when getter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateGetter();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when setter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateSetter(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call callback when setter is called with wrong parameter', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateSetter(2);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call callback when getter of getter&setter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateGetterOfGetterAndSetter();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should call callback when setter of getter&setter is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call callback when setter of getter&setter is called with wrong parameter', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(2);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateFunction(null);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original getter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateGetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateGetter();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateSetter(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call the original setter if called with other argument', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateSetter(2);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call the original getter of getter and setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateGetterOfGetterAndSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateGetterOfGetterAndSetter();

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call the original setter of getter and setter', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateSetterOfGetterAndSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call the original setter of getter and setter if called with other argument', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateSetterOfGetterAndSetterCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(2);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.callPrivateFunction(arg);

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 2;

        var actualArg1;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 2)
          .callback((_arg1) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateFunction(arg1);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
      });

      it('should pass the same parameters to setter', () => {
        // Arrange
        var arg1 = 2;

        var actualArg1;
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 2)
          .callback((_arg1) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateSetter(arg1);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
      });

      it('should pass the same parameters to setter of getter&setter', () => {
        // Arrange
        var arg1 = 2;

        var actualArg1;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 2)
          .callback((_arg1) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(arg1);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
      });

      it('should not call if not matching', () => {
        // Arrange
        var arg = 'some text';

        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateFunction(arg);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call if not matching 2', () => {
        // Arrange
        var arg1 = 3;

        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 2)
          .callback(() => {
            numberOfTimesCalled++;
          });

        // Act
        testObject.callPrivateFunction(arg1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call if not matching 3', () => {
        // Arrange
        var arg1 = 3;

        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME)
          .callback(() => {
            numberOfTimesCalled++;
          });

        // Act
        testObject.callPrivateFunction(undefined);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call setter if not matching', () => {
        // Arrange
        var arg = 'some text';

        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, It.isAny(Number)).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateSetter(arg);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call setter of getter&setter if not matching', () => {
        // Arrange
        var arg = 'some text';

        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number)).callback(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(arg);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(null);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(null);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => {
          numberOfTimesCalled1++;
        }).callback(() => {
          numberOfTimesCalled2++;
      		}).callback(() => {
          numberOfTimesCalled3++;
      		}).callback(() => {
          numberOfTimesCalled4++;
      		});

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should pass the same parameters to all the callbacks when function is called', () => {
        // Arrange
        var arg = 12;

        var actualArg;
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

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

    });

    describe('returns', () => {


      it('returns - should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var numberOfTimesCalled = 0;
        testObject.onPrivateFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('returns - should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('returns - should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('returns - should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
          numberOfTimesCalled++;
        });

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should call returnFunction when function is called', () => {
        // Arrange
        var numberOfTimesCalled = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
          numberOfTimesCalled++;
        });

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
      });

      it('should not call the original function', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        testObject.onPrivateFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should pass the same parameters', () => {
        // Arrange
        var arg = 1;

        var actualArg;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns((_arg) => {
          actualArg = _arg;
        });

        // Act
        testObject.callPrivateFunction(arg);

        // Assert
        expect(actualArg).to.be.equal(arg);
      });

      it('should pass the same parameters 2', () => {
        // Arrange
        var arg1 = 1;

        var actualArg1;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, arg1)
          .lazyReturns((_arg1, _arg2, _arg3) => {
            actualArg1 = _arg1;
          });

        // Act
        testObject.callPrivateFunction(arg1);

        // Assert
        expect(actualArg1).to.be.equal(arg1);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
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

        // Assert
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

        var numberOfTimesCalled = 0;
        testObject.onNoArgumentsFunctionCalled = () => {
          numberOfTimesCalled++;
        };

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call other original functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
        };

        testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        testObject.manyArgumentsFunction = shouldNotHappen;
        testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
          testObject.callPrivateFunction(1);
        } catch (e) {
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call callbacks on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should not call lazyReturns on other functions', () => {
        // Arrange
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var numberOfTimesCalled = 0;
        var shouldNotHappen = () => {
          numberOfTimesCalled++;
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

        // Assert
        expect(numberOfTimesCalled).to.be.equal(0);
      });

      it('should throw the error', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError);

        // Act
        var actualError;
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

      it('should throw the error for getter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_NAME).throws(thrownError);

        // Act
        var actualError;
        try {
          testObject.callPrivateGetter();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

      it('should throw the error for setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        // Act
        var actualError;
        try {
          testObject.callPrivateSetter(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

      it('should not throw the error for setter if arguments dont match', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.callPrivateSetter(2);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('should throw the error for getter of getter&setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        // Act
        var actualError;
        try {
          testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

      it('should throw the error for setter of getter&setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        // Act
        var actualError;
        try {
          testObject.callPrivateSetterOfGetterAndSetter(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

      it('should not throw the error for setter of getter&setter if arguments dont match', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('setup getter should not throw on setter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('setup setter should not throw on getter', () => {
        // Arrange
        var thrownError = {};
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        // Act
        var numberOfTimesThrown = 0;
        try {
          testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
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
        var actualError;
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError4);
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
        var actualError;
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
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

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws(thrownError)
          .lazyReturns(() => {
            numberOfTimesCalled1++;
            return 1;
          })
          .lazyReturns(() => {
            numberOfTimesCalled2++;
            return 2;
          })
          .lazyReturns(() => {
            numberOfTimesCalled3++;
            return 3;
          })
          .callback(() => numberOfTimesCalled4++)
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks and the lazy returns but return last configured one 2', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws(thrownError)
          .lazyReturns(() => {
            numberOfTimesCalled1++;
            return 1;
          })
          .lazyReturns(() => {
            numberOfTimesCalled2++;
            return 2;
          })
          .returns(3)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
            return returnValue;
          })
          .callback(() => numberOfTimesCalled4++);

        // Act
        var result = testObject.callPrivateFunction(1);

        // Assert
        expect(result).to.be.equal(returnValue);
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('should call all the callbacks and the lazy returns but throw last configured error', () => {
        // Arrange
        var returnValue = {};
        var thrownError = {};

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .throws('asdasd')
          .lazyReturns(() => {
            numberOfTimesCalled1++;
            return 1;
          })
          .lazyReturns(() => {
            numberOfTimesCalled2++;
            return 2;
          })
          .returns(returnValue)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
            return 3;
          })
          .throws(thrownError)
          .callback(() => numberOfTimesCalled4++);

        // Act
        var actualError;
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
        expect(actualError).to.be.equal(thrownError);
      });

      it('should call only the matching set', () => {
        // Arrange
        var returnValue = {};

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        var numberOfTimesCalled5 = 0;
        var numberOfTimesCalled6 = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => {
            numberOfTimesCalled1++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled2++;
          });

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 'aaa')
          .throws('error')
          .lazyReturns(() => {
            numberOfTimesCalled3++;
          })
          .callback(() => {
            numberOfTimesCalled4++;
          });

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 'bbb')
          .lazyReturns(() => {
            numberOfTimesCalled5++;
          })
          .callback(() => {
            numberOfTimesCalled6++;
          })
          .returns(returnValue);

        // Act
        var result = testObject.callPrivateFunction('bbb');

        // Assert
        expect(result).to.be.equal(returnValue);
        expect(numberOfTimesCalled1).to.be.equal(0);
        expect(numberOfTimesCalled2).to.be.equal(0);
        expect(numberOfTimesCalled3).to.be.equal(0);
        expect(numberOfTimesCalled4).to.be.equal(0);
        expect(numberOfTimesCalled5).to.be.equal(1);
        expect(numberOfTimesCalled6).to.be.equal(1);
      });

      it('if both setups match should call both', () => {
        // Arrange

        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
          .lazyReturns(() => {
            numberOfTimesCalled1++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled2++;
          });

        mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled4++;
          });

        // Act
        testObject.callPrivateFunction(1);

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('if both setups match should call both for setter', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, It.isAny(Number))
          .lazyReturns(() => {
            numberOfTimesCalled1++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled2++;
          });

        mole.setupPrivate(TestObject.PRIVATE_SETTER_NAME, 1)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled4++;
          });

        // Act
        testObject.callPrivateSetter(1);

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
      });

      it('if both setups match should call both for setter of getter and setter', () => {
        // Arrange
        var numberOfTimesCalled1 = 0;
        var numberOfTimesCalled2 = 0;
        var numberOfTimesCalled3 = 0;
        var numberOfTimesCalled4 = 0;
        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number))
          .lazyReturns(() => {
            numberOfTimesCalled1++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled2++;
          });

        mole.setupPrivate(TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1)
          .lazyReturns(() => {
            numberOfTimesCalled3++;
          })
          .returns('return value')
          .callback(() => {
            numberOfTimesCalled4++;
          });

        // Act
        testObject.callPrivateSetterOfGetterAndSetter(1);

        // Assert
        expect(numberOfTimesCalled1).to.be.equal(1);
        expect(numberOfTimesCalled2).to.be.equal(1);
        expect(numberOfTimesCalled3).to.be.equal(1);
        expect(numberOfTimesCalled4).to.be.equal(1);
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
        var actualError;
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
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
        var actualError;
        try {
          testObject.callPrivateFunction(1);
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

    });

  });

  describe('isStrict', () => {

    describe('true', () => {

      it('isStrict - true - no setup should throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - no setup for getter should throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getter;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - no setup for setter should throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.setter = 1;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - no setup for getter of getter and setter should throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getterAndSetter;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - no setup for setter of getter and setter should throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getterAndSetter = 1;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - has callback setup should call the callback and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          numberOfTimesCalled++;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - getter has callback setup should call the callback and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getter).callback(() => {
          numberOfTimesCalled++;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getter;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - setter has callback setup should call the callback and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesCalled = 0;
        mole.setup(_ => _.setter = 1).callback(() => {
          numberOfTimesCalled++;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.setter = 1;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - getter of getter&setter has callback setup should call the callback and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getterAndSetter).callback(() => {
          numberOfTimesCalled++;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getterAndSetter;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - setter of getter&setter has callback setup should call the callback and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var numberOfTimesCalled = 0;
        mole.setup(_ => _.getterAndSetter = 1).callback(() => {
          numberOfTimesCalled++;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getterAndSetter = 1;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - has callback setup  for other argument should throw error', () => {
        // Arrange
        mole.isStrict = true;

        mole.setup(_ => _.oneArgumentsFunction(1)).callback(() => { });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.oneArgumentsFunction(2);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - setter has callback setup for other argument should throw error', () => {
        // Arrange
        mole.isStrict = true;

        mole.setup(_ => _.setter = 1).callback(() => { });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.setter = 2;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - setter of getter&setter has callback setup for other argument should throw error', () => {
        // Arrange
        mole.isStrict = true;

        mole.setup(_ => _.getterAndSetter = 1).callback(() => { });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.getterAndSetter = 2;
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(1);
      });

      it('isStrict - true - has lazyReturns setup should call the lazyReturns and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var returnValue = {};
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          numberOfTimesCalled++;
          return returnValue;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - has returns setup should return the returnValue and not throw error', () => {
        // Arrange
        mole.isStrict = true;

        var returnValue = {};
        mole.setup(_ => _.noArgumentsFunction()).returns(returnValue);

        var numberOfTimesThrown = 0;
        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - true - has throws setup should throw the thrownError', () => {
        // Arrange
        mole.isStrict = true;

        var thrownError = {};
        mole.setup(_ => _.noArgumentsFunction()).throws(thrownError);

        var actualError;
        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

    });

    describe('false', () => {

      it('isStrict - false - no setup should not throw error', () => {
        // Arrange
        mole.isStrict = false;

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - false - has callbeck setup should call the callback and not throw error', () => {
        // Arrange
        mole.isStrict = false;

        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
          numberOfTimesCalled++;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - false - has lazyReturns setup should call the lazyReturns and not throw error', () => {
        // Arrange
        mole.isStrict = false;

        var returnValue = {};
        var numberOfTimesCalled = 0;
        mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
          numberOfTimesCalled++;
          return returnValue;
        });

        var numberOfTimesThrown = 0;
        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesCalled).to.be.equal(1);
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - false - has returns setup should return the returnValue and not throw error', () => {
        // Arrange
        mole.isStrict = false;

        var returnValue = {};
        mole.setup(_ => _.noArgumentsFunction()).returns(returnValue);

        var numberOfTimesThrown = 0;
        try {
          // Act
          var result = testObject.noArgumentsFunction();

          // Assert
          expect(result).to.be.equal(returnValue);
        } catch (error) {
          numberOfTimesThrown++;
        }

        // Assert
        expect(numberOfTimesThrown).to.be.equal(0);
      });

      it('isStrict - false - has throws setup should throw the thrownError', () => {
        // Arrange
        mole.isStrict = false;

        var thrownError = {};
        mole.setup(_ => _.noArgumentsFunction()).throws(thrownError);

        var actualError;
        try {
          // Act
          testObject.noArgumentsFunction();
        } catch (error) {
          actualError = error;
        }

        // Assert
        expect(actualError).to.be.equal(thrownError);
      });

    });

  });

  describe('staticFunction', () => {

    it('Override static function', () => {
      // Arrange
      var mole = new Mole<any>(TestObject);

      // Act
      var numberOfTimesCalled = 0;
      mole.setup(_ => { TestObject.staticFunction(); }).callback(() => {
        numberOfTimesCalled++;
      });

      TestObject.staticFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

  });

  describe('setup', () => {

    it('inheritence - callback on sons function should call callback', () => {
      // Arrange
      var testObjectSon = new TestObjectSon();
      var mole = new Mole<TestObjectSon>(testObjectSon);

      // Act
      var numberOfTimesCalled = 0;
      mole.setup(_ => _.noArgumentsFunction()).callback(() => {
        numberOfTimesCalled++;
      });

      testObjectSon.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled).to.be.equal(1);
    });

  });

  describe('dispose', () => {

    it('before dispose should not call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.noArgumentsFunction()).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(0);
      expect(numberOfTimesCalled2).to.be.equal(1);
    });

    it('before dispose should not call the original getter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onGetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.getter).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      testObject.getter;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(0);
      expect(numberOfTimesCalled2).to.be.equal(1);
    });

    it('before dispose should not call the original setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onSetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.setter = 1).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      testObject.setter = 1;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(0);
      expect(numberOfTimesCalled2).to.be.equal(1);
    });

    it('before dispose should not call the original getter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onGetterOfGetterAndSetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.getterAndSetter).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      testObject.getterAndSetter;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(0);
      expect(numberOfTimesCalled2).to.be.equal(1);
    });

    it('before dispose should not call the original setter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onSetterOfGetterAndSetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.getterAndSetter = 1).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      testObject.getterAndSetter = 1;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(0);
      expect(numberOfTimesCalled2).to.be.equal(1);
    });

    it('should call the original function', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onNoArgumentsFunctionCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.noArgumentsFunction()).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      mole.dispose();
      testObject.noArgumentsFunction();

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(1);
      expect(numberOfTimesCalled2).to.be.equal(0);
    });

    it('should call the original getter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onGetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.getter).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      mole.dispose();
      testObject.getter;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(1);
      expect(numberOfTimesCalled2).to.be.equal(0);
    });

    it('should call the original setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onSetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.setter = 1).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      mole.dispose();
      testObject.setter = 1;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(1);
      expect(numberOfTimesCalled2).to.be.equal(0);
    });

    it('should call the original getter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onGetterOfGetterAndSetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.getterAndSetter).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      mole.dispose();
      testObject.getterAndSetter;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(1);
      expect(numberOfTimesCalled2).to.be.equal(0);
    });

    it('should call the original setter of getter and setter', () => {
      // Arrange
      var testObject = new TestObject();
      var mole = new Mole<TestObject>(testObject);

      var numberOfTimesCalled1 = 0;
      testObject.onSetterOfGetterAndSetterCalled = () => {
        numberOfTimesCalled1++;
      };

      var numberOfTimesCalled2 = 0;
      mole.setup(_ => _.getterAndSetter = 1).callback(() => {
        numberOfTimesCalled2++;
      });

      // Act
      mole.dispose();
      testObject.getterAndSetter = 1;

      // Assert
      expect(numberOfTimesCalled1).to.be.equal(1);
      expect(numberOfTimesCalled2).to.be.equal(0);
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
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(objectMole).to.be.null;
    });

    it('set to false should not create mole of the return value', () => {
      // Arrange
      mole.moleReturnValue = false;

      // Act
      var result: TestObject = testObject.complexReturnFunction();
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.false;
      expect(objectMole).to.be.null;
    });

    it('set to true should create mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      // Act
      var result: TestObject = testObject.complexReturnFunction();
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(objectMole).to.not.be.null;
    });

    it('set to true should create new mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexReturnFunction();
      var objectMole = Mole.findMoleByObject(returnValue);
      objectMole.setup(_ => _.returning1Function()).returns(2);

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
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(objectMole).to.not.be.null;
    });

    it('set to true should create new mole for the return value return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexReturnFunction().complexReturnFunction();
      var objectMole = Mole.findMoleByObject(returnValue);
      objectMole.setup(_ => _.returning1Function()).returns(2);

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
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.false;
      expect(objectMole).to.be.null;
    });

    it('set to true should create mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      // Act
      var result: TestObject = testObject.complexGetterFunction;
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(objectMole).to.not.be.null;
    });

    it('set to true should create new mole for the return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexGetterFunction;
      var objectMole = Mole.findMoleByObject(returnValue);
      objectMole.setup(_ => _.returning1Function()).returns(2);

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
      var objectMole = Mole.findMoleByObject(result);

      // Assert
      expect(mole.moleReturnValue).to.be.true;
      expect(objectMole).to.not.be.null;
    });

    it('set to true should create new mole for the return value return value', () => {
      // Arrange
      mole.moleReturnValue = true;

      var returnValue: TestObject = testObject.complexGetterFunction.complexGetterFunction;
      var objectMole = Mole.findMoleByObject(returnValue);
      objectMole.setup(_ => _.returning1Function()).returns(2);

      // Act
      var result1 = testObject.returning1Function();
      var result2 = returnValue.returning1Function();

      // Assert
      expect(result1).to.be.equal(1);
      expect(result2).to.be.equal(2);
    });

  });

});
