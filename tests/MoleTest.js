"use strict";
var chai_1 = require('chai');
var TestObject_1 = require('./testsCommon/TestObject');
var TestObjectSon_1 = require('./testsCommon/TestObjectSon');
var index_1 = require('../index');
var ItIsBase_1 = require('../src/it/ItIsBase');
describe('Mole', function () {
    var testObject;
    var mole;
    beforeEach(function () {
        testObject = new TestObject_1.TestObject();
        mole = new index_1.Mole(testObject);
    });
    afterEach(function () {
        mole.dispose();
    });
    describe('constructor', function () {
        it('should initialize correctly', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            chai_1.expect(mole.object).to.be.equal(testObject);
        });
    });
    describe('noArgumentsFunction', function () {
        it('should call only the original function', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
            var numberOfTimesNoArgumentsFunctionCalled = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesNoArgumentsFunctionCalled++;
            };
            testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onGetterCalled = shouldNotBeCalled;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onSetterCalled = shouldNotBeCalled;
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(1);
        });
    });
    describe('oneArgumentsFunction', function () {
        it('one arguments should call only the original function', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
            var arg = {};
            testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onGetterCalled = shouldNotBeCalled;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onSetterCalled = shouldNotBeCalled;
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = arg;
            };
            testObject.oneArgumentsFunction(arg);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(actualArg).to.be.equal(arg);
        });
    });
    describe('manyArgumentsFunction', function () {
        it('many arguments should call only the original function', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
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
            testObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                actualArg1 = _arg1;
                actualArg2 = _arg2;
                actualArg3 = _arg3;
            };
            testObject.manyArgumentsFunction(arg1, arg2, arg3);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(actualArg1).to.be.equal(arg1);
            chai_1.expect(actualArg2).to.be.equal(arg2);
            chai_1.expect(actualArg3).to.be.equal(arg3);
        });
    });
    describe('getter', function () {
        it('should call only the original getter', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
            testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onSetterCalled = shouldNotBeCalled;
            var numberOfTimesGetterCalled = 0;
            testObject.onGetterCalled = function () { return numberOfTimesGetterCalled++; };
            var value = {};
            testObject.getterValue = value;
            var actualValue = testObject.getter;
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesGetterCalled).to.be.equal(1);
            chai_1.expect(actualValue).to.be.equal(value);
        });
        it('should call only the original getter', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
            testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onSetterCalled = shouldNotBeCalled;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterCalled = shouldNotBeCalled;
            var numberOfTimesGetterOfGetterAndSetterCalled = 0;
            testObject.onGetterOfGetterAndSetterCalled = function () { return numberOfTimesGetterOfGetterAndSetterCalled++; };
            var value = {};
            testObject.getterAndSetterValue = value;
            var actualValue = testObject.getterAndSetter;
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesGetterOfGetterAndSetterCalled).to.be.equal(1);
            chai_1.expect(actualValue).to.be.equal(value);
        });
    });
    describe('setter', function () {
        it('should call only the original setter', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
            testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterCalled = shouldNotBeCalled;
            var numberOfTimesSetterCalled = 0;
            testObject.onSetterCalled = function () { return numberOfTimesSetterCalled++; };
            var value = {};
            testObject.setter = value;
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesSetterCalled).to.be.equal(1);
            chai_1.expect(testObject.setterValue).to.be.equal(value);
        });
        it('should call only the original setter', function () {
            var numberOfTimesCalled = 0;
            var shouldNotBeCalled = function () { return numberOfTimesCalled++; };
            testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
            testObject.onSetterCalled = shouldNotBeCalled;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
            testObject.onGetterCalled = shouldNotBeCalled;
            var numberOfTimesSetterOfGetterAndSetterCalled = 0;
            testObject.onSetterOfGetterAndSetterCalled = function () { return numberOfTimesSetterOfGetterAndSetterCalled++; };
            var value = {};
            testObject.getterAndSetter = value;
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesSetterOfGetterAndSetterCalled).to.be.equal(1);
            chai_1.expect(testObject.getterAndSetterValue).to.be.equal(value);
        });
    });
    describe('verify', function () {
        it('should verify only the no arguments function', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.noArgumentsFunction();
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.true;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.false;
            chai_1.expect(verifyGetter).to.be.false;
            chai_1.expect(verifySetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.false;
        });
        it('should verify only the one argument function', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.oneArgumentsFunction(arg1);
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.true;
            chai_1.expect(verifyManyArguments).to.be.false;
            chai_1.expect(verifyGetter).to.be.false;
            chai_1.expect(verifySetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.false;
        });
        it('should verify only the many argument function', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.manyArgumentsFunction(arg1, arg2, arg3);
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.true;
            chai_1.expect(verifyGetter).to.be.false;
            chai_1.expect(verifySetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.false;
        });
        it('should verify only the getter', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            var value = testObject.getter;
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.false;
            chai_1.expect(verifyGetter).to.be.true;
            chai_1.expect(verifySetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.false;
        });
        it('should verify only the setter', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.setter = arg1;
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.false;
            chai_1.expect(verifyGetter).to.be.false;
            chai_1.expect(verifySetter).to.be.true;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.false;
        });
        it('should verify only the getter of getter and setter', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            var value = testObject.getterAndSetter;
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.false;
            chai_1.expect(verifyGetter).to.be.false;
            chai_1.expect(verifySetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.true;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.false;
        });
        it('should verify only the setter of getter and setter', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.getterAndSetter = arg1;
            var verifyNoArguments = mole.verify(function (_) { return _.noArgumentsFunction(); });
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            var verifyGetter = mole.verify(function (_) { return _.getter; });
            var verifySetter = mole.verify(function (_) { return _.setter = arg1; });
            var verifyGetterAndSetterGetter = mole.verify(function (_) { return _.getterAndSetter; });
            var verifyGetterAndSetterSetter = mole.verify(function (_) { return _.getterAndSetter = arg1; });
            chai_1.expect(verifyNoArguments).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.false;
            chai_1.expect(verifyGetter).to.be.false;
            chai_1.expect(verifySetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterGetter).to.be.false;
            chai_1.expect(verifyGetterAndSetterSetter).to.be.true;
        });
        it('after setups should count ok', function () {
            mole.setup(function (_) { return _.getter; }).callback(function () { });
            testObject.getter;
            testObject.getter;
            testObject.getter;
            testObject.getter;
            mole.setup(function (_) { return _.oneArgumentsFunction(1); }).callback(function () { });
            mole.setup(function (_) { return _.oneArgumentsFunction(2); }).callback(function () { });
            mole.setup(function (_) { return _.oneArgumentsFunction(3); }).callback(function () { });
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
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(4))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(1); }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(2); }, index_1.Times.exact(2))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(3); }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(4); }, index_1.Times.exact(4))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }, index_1.Times.exact(10))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }, index_1.Times.exact(11))).to.be.false;
        });
        it('complex test', function () {
            var argSet = [{}, {}, {}, {}, {}, {}];
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
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(4))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(5))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(6))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[0]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[1]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[3]); })).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[0]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[0]); }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[0]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[0]); }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[0]); }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[1]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[1]); }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[1]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[1]); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.oneArgumentsFunction(argSet[2]); }, index_1.Times.exact(5))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]); }, index_1.Times.exact(5))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]); }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]); }, index_1.Times.exact(2))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]); }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]); }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]); }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]); })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]); }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]); }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]); })).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]); }, index_1.Times.exact(0))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]); }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]); }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]); }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getter; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(4))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(5))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(6))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[0]; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[1]; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[3]; })).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[0]; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[0]; }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[0]; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[0]; }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[0]; }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[1]; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[1]; }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[1]; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[1]; }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.setter = argSet[2]; }, index_1.Times.exact(5))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(4))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(5))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(6))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[0]; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[1]; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; })).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[3]; })).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[0]; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[0]; }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[0]; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[0]; }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[0]; }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[1]; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[1]; }, index_1.Times.exact(1))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[1]; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[1]; }, index_1.Times.exact(3))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; }, index_1.Times.exact(0))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; }, index_1.Times.exact(1))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; }, index_1.Times.exact(2))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; }, index_1.Times.exact(3))).to.be.true;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; }, index_1.Times.exact(4))).to.be.false;
            chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = argSet[2]; }, index_1.Times.exact(5))).to.be.false;
        });
        it('times returns false should return false', function () {
            var timesMole = {
                match: function () { return false; }
            };
            var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, timesMole);
            chai_1.expect(result).to.be.false;
        });
        it('times returns true should return true', function () {
            var timesMole = {
                match: function () { return true; }
            };
            var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, timesMole);
            chai_1.expect(result).to.be.true;
        });
        it('ItIsBase returns false should return false', function () {
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () { return false; };
            testObject.setter = 1;
            var result = mole.verify(function (_) { return _.setter = itIs; });
            chai_1.expect(result).to.be.false;
        });
        it('ItIsBase returns false should return true', function () {
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () { return true; };
            testObject.setter = 1;
            var result = mole.verify(function (_) { return _.setter = itIs; });
            chai_1.expect(result).to.be.true;
        });
        describe('no arguments', function () {
            it('was not called should not find a match', function () {
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 2 matches', function () {
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should return true on 0 matches', function () {
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should return false on 0 matches', function () {
                testObject.noArgumentsFunction();
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called should return true on 1 matches', function () {
                testObject.noArgumentsFunction();
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should return false on 2 matches', function () {
                testObject.noArgumentsFunction();
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should return true on 2 matches', function () {
                testObject.noArgumentsFunction();
                testObject.noArgumentsFunction();
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should return false on 1 matches', function () {
                testObject.noArgumentsFunction();
                testObject.noArgumentsFunction();
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should return false on 3 matches', function () {
                testObject.noArgumentsFunction();
                testObject.noArgumentsFunction();
                var result = mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
        });
        describe('one argument', function () {
            it('was not called should not find a match', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 1 match', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 2 matches', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should find 0 matches', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should find a match', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); });
                chai_1.expect(result).to.be.true;
            });
            it('was called should find 1 match', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should not find 2 matches', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called should not verify 0 matches', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should find a match', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should find 2 matches', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not find 0 matches', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not find 1 matches', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not find 3 matches', function () {
                var arg = {};
                testObject.oneArgumentsFunction(arg);
                testObject.oneArgumentsFunction(arg);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg); }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify first arg', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify first arg called 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify first arg called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                testObject.oneArgumentsFunction(arg1);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify second arg was called', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify second arg was called 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify second arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify second arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify second arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify second arg was called 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should verify second arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called 3 times should not verify second arg was called 3 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg2); }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg3); });
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg was called 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg3); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg3); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify with another arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(arg3); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('ItIsBase returns false should return false', function () {
                var itIs = new ItIsBase_1.ItIsBase();
                itIs.match = function () { return false; };
                testObject.oneArgumentsFunction(1);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(itIs); });
                chai_1.expect(result).to.be.false;
            });
            it('ItIsBase returns false should return true', function () {
                var itIs = new ItIsBase_1.ItIsBase();
                itIs.match = function () { return true; };
                testObject.oneArgumentsFunction(1);
                var result = mole.verify(function (_) { return _.oneArgumentsFunction(itIs); });
                chai_1.expect(result).to.be.true;
            });
        });
        describe('many arguments', function () {
            it('was not called should not verify', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not verify for 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not verify for 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should verify for 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should verify', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
                chai_1.expect(result).to.be.true;
            });
            it('was called should verify for 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should not verify for 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called should not verify for 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify for 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify for 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify for 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify for 3 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should verify first set', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]); });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice with different sets should verify first set 1 time', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice with different sets should not verify first set 0 times', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should not verify first set 2 times', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should verify second set', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]); });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice with different sets should verify second set 1 time', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice with different sets should not verify second set 0 times', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should not verify second set 2 times', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should not verify another set', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]); });
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should not verify another set 1 time', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should not verify another set 2 times', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice with different sets should verify another set 0 times', function () {
                var argSet1 = [{}, {}, {}];
                var argSet2 = [{}, {}, {}];
                testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
                testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]); }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('ItIsBase returns false should return false', function () {
                var itIs = new ItIsBase_1.ItIsBase();
                itIs.match = function () { return false; };
                testObject.manyArgumentsFunction(1, 1, 1);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(itIs, itIs, itIs); });
                chai_1.expect(result).to.be.false;
            });
            it('ItIsBase returns true should return true', function () {
                var itIs = new ItIsBase_1.ItIsBase();
                itIs.match = function () { return true; };
                testObject.manyArgumentsFunction(1, 1, 1);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(itIs, itIs, itIs); });
                chai_1.expect(result).to.be.true;
            });
            it('ItIsBase returns true and false should return false', function () {
                var trueItIs = new ItIsBase_1.ItIsBase();
                trueItIs.match = function () { return true; };
                var falseItIs = new ItIsBase_1.ItIsBase();
                falseItIs.match = function () { return false; };
                testObject.manyArgumentsFunction(1, 1, 1);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(trueItIs, trueItIs, falseItIs); });
                chai_1.expect(result).to.be.false;
            });
            it('ItIsBase returns true and other arguments dont match should return false', function () {
                var trueItIs = new ItIsBase_1.ItIsBase();
                trueItIs.match = function () { return true; };
                testObject.manyArgumentsFunction(1, 1, 1);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(trueItIs, trueItIs, 2); });
                chai_1.expect(result).to.be.false;
            });
            it('called many times ItIsBase returns true should return true', function () {
                var trueItIs = new ItIsBase_1.ItIsBase();
                trueItIs.match = function () { return true; };
                testObject.manyArgumentsFunction(1, 1, 2);
                testObject.manyArgumentsFunction(1, 1, 1);
                testObject.manyArgumentsFunction(1, 1, 1);
                testObject.manyArgumentsFunction(1, 1, 2);
                testObject.manyArgumentsFunction(1, 1, 1);
                testObject.manyArgumentsFunction(1, 1, 1);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(trueItIs, trueItIs, 2); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('called many times ItIsBase returns true once should return true', function () {
                var trueItIs = new ItIsBase_1.ItIsBase();
                var numberOfTimesReturnedTrue = 0;
                trueItIs.match = function () {
                    numberOfTimesReturnedTrue++;
                    return numberOfTimesReturnedTrue <= 1;
                };
                testObject.manyArgumentsFunction(1, 1, 2);
                testObject.manyArgumentsFunction(1, 1, 1);
                testObject.manyArgumentsFunction(1, 1, 1);
                testObject.manyArgumentsFunction(1, 1, 2);
                testObject.manyArgumentsFunction(1, 1, 1);
                testObject.manyArgumentsFunction(1, 1, 1);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(1, trueItIs, 2); }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('called with numbers and strings should return only the strings', function () {
                var numberItIs = index_1.It.isAny(Number);
                var stringItIs = index_1.It.isAny(String);
                testObject.manyArgumentsFunction(11, 1, 1);
                testObject.manyArgumentsFunction(12, 1, 2);
                testObject.manyArgumentsFunction(13, '1', 3);
                testObject.manyArgumentsFunction(14, 1, 4);
                testObject.manyArgumentsFunction(15, '112', 5);
                testObject.manyArgumentsFunction(16, 1, 6);
                var result = mole.verify(function (_) { return _.manyArgumentsFunction(numberItIs, stringItIs, numberItIs); }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
        });
        describe('getter', function () {
            it('was not called should not find a match', function () {
                var result = mole.verify(function (_) { return _.getter; });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 2 matches', function () {
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should return true on 0 matches', function () {
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should return false on 0 matches', function () {
                var value = testObject.getter;
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called should return true on 1 matches', function () {
                var value = testObject.getter;
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should return false on 2 matches', function () {
                var value = testObject.getter;
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should return true on 2 matches', function () {
                var value1 = testObject.getter;
                var value2 = testObject.getter;
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should return false on 1 matches', function () {
                var value1 = testObject.getter;
                var value2 = testObject.getter;
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should return false on 3 matches', function () {
                var value1 = testObject.getter;
                var value2 = testObject.getter;
                var result = mole.verify(function (_) { return _.getter; }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find a match', function () {
                var result = mole.verify(function (_) { return _.getterAndSetter; });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 2 matches', function () {
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should return true on 0 matches', function () {
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should return false on 0 matches', function () {
                var value = testObject.getterAndSetter;
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called should return true on 1 matches', function () {
                var value = testObject.getterAndSetter;
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should return false on 2 matches', function () {
                var value = testObject.getterAndSetter;
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should return true on 2 matches', function () {
                var value1 = testObject.getterAndSetter;
                var value2 = testObject.getterAndSetter;
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should return false on 1 matches', function () {
                var value1 = testObject.getterAndSetter;
                var value2 = testObject.getterAndSetter;
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should return false on 3 matches', function () {
                var value1 = testObject.getterAndSetter;
                var value2 = testObject.getterAndSetter;
                var result = mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
        });
        describe('setter', function () {
            it('was not called should not find a match', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.setter = arg; });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 1 match', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 2 matches', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should find 0 matches', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should find a match', function () {
                var arg = {};
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; });
                chai_1.expect(result).to.be.true;
            });
            it('was called should find 1 match', function () {
                var arg = {};
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should not find 2 matches', function () {
                var arg = {};
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called should not verify 0 matches', function () {
                var arg = {};
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should find a match', function () {
                var arg = {};
                testObject.setter = arg;
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should find 2 matches', function () {
                var arg = {};
                testObject.setter = arg;
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not find 0 matches', function () {
                var arg = {};
                testObject.setter = arg;
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not find 1 matches', function () {
                var arg = {};
                testObject.setter = arg;
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not find 3 matches', function () {
                var arg = {};
                testObject.setter = arg;
                testObject.setter = arg;
                var result = mole.verify(function (_) { return _.setter = arg; }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify first arg', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg1; });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify first arg called 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg1; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify first arg called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg1; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg1; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg1; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                testObject.setter = arg1;
                var result = mole.verify(function (_) { return _.setter = arg1; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify second arg was called', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify second arg was called 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify second arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify second arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify second arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify second arg was called 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should verify second arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called 3 times should not verify second arg was called 3 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg2; }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg3; });
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg was called 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg3; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg3; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify with another arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.setter = arg1;
                testObject.setter = arg2;
                var result = mole.verify(function (_) { return _.setter = arg3; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was not called should not find a match', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; });
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 1 match', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should not find 2 matches', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was not called should find 0 matches', function () {
                var arg = {};
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('was called should find a match', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; });
                chai_1.expect(result).to.be.true;
            });
            it('was called should find 1 match', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called should not find 2 matches', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called should not verify 0 matches', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should find a match', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should find 2 matches', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not find 0 matches', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not find 1 matches', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not find 3 matches', function () {
                var arg = {};
                testObject.getterAndSetter = arg;
                testObject.getterAndSetter = arg;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg; }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify first arg', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg1; });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify first arg called 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg1; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify first arg called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg1; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg1; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg1; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should verify first arg called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                testObject.getterAndSetter = arg1;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg1; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify second arg was called', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; });
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should verify second arg was called 1 time', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.true;
            });
            it('was called twice should not verify second arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify second arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify second arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should not verify second arg was called 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called 3 times should verify second arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.true;
            });
            it('was called 3 times should not verify second arg was called 3 times', function () {
                var arg1 = {};
                var arg2 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg2; }, index_1.Times.exact(3));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg3; });
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg was called 1 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg3; }, index_1.Times.exact(1));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should not verify with another arg was called 2 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg3; }, index_1.Times.exact(2));
                chai_1.expect(result).to.be.false;
            });
            it('was called twice should verify with another arg was called 0 times', function () {
                var arg1 = {};
                var arg2 = {};
                var arg3 = {};
                testObject.getterAndSetter = arg1;
                testObject.getterAndSetter = arg2;
                var result = mole.verify(function (_) { return _.getterAndSetter = arg3; }, index_1.Times.exact(0));
                chai_1.expect(result).to.be.true;
            });
            it('ItIsBase returns false should return false', function () {
                var itIs = new ItIsBase_1.ItIsBase();
                itIs.match = function () { return false; };
                testObject.getterAndSetter = 1;
                var result = mole.verify(function (_) { return _.getterAndSetter = itIs; });
                chai_1.expect(result).to.be.false;
            });
            it('ItIsBase returns false should return true', function () {
                var itIs = new ItIsBase_1.ItIsBase();
                itIs.match = function () { return true; };
                testObject.getterAndSetter = 1;
                var result = mole.verify(function (_) { return _.getterAndSetter = itIs; });
                chai_1.expect(result).to.be.true;
            });
        });
    });
    describe('verifyPrivate', function () {
        it('should verify only the private function', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.callPrivateFunction(1);
            var verifyPrivateFunction = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [1]);
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            chai_1.expect(verifyPrivateFunction).to.be.true;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.false;
        });
        it('should verify only the many argument function', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.manyArgumentsFunction(arg1, arg2, arg3);
            var verifyPrivateFunction = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [index_1.It.isAny(Object)]);
            var verifyOneArguments = mole.verify(function (_) { return _.oneArgumentsFunction(arg1); });
            var verifyManyArguments = mole.verify(function (_) { return _.manyArgumentsFunction(arg1, arg2, arg3); });
            chai_1.expect(verifyPrivateFunction).to.be.false;
            chai_1.expect(verifyOneArguments).to.be.false;
            chai_1.expect(verifyManyArguments).to.be.true;
        });
        it('was not called should not find a match', function () {
            var arg = {};
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg]);
            chai_1.expect(result).to.be.false;
        });
        it('was not called should not find 1 match', function () {
            var arg = {};
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(1));
            chai_1.expect(result).to.be.false;
        });
        it('was not called should not find 2 matches', function () {
            var arg = {};
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(2));
            chai_1.expect(result).to.be.false;
        });
        it('was not called should find 0 matches', function () {
            var arg = {};
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(0));
            chai_1.expect(result).to.be.true;
        });
        it('was called should find a match', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg]);
            chai_1.expect(result).to.be.true;
        });
        it('was called should find 1 match', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(1));
            chai_1.expect(result).to.be.true;
        });
        it('was called should not find 2 matches', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(2));
            chai_1.expect(result).to.be.false;
        });
        it('was called should not verify 0 matches', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(0));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should find a match', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg]);
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should find 2 matches', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(2));
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should not find 0 matches', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(0));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not find 1 matches', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(1));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not find 3 matches', function () {
            var arg = {};
            testObject.callPrivateFunction(arg);
            testObject.callPrivateFunction(arg);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg], index_1.Times.exact(3));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should verify first arg', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg1]);
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should verify first arg called 1 time', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg1], index_1.Times.exact(1));
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should not verify first arg called 0 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg1], index_1.Times.exact(0));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not verify first arg called 2 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg1], index_1.Times.exact(2));
            chai_1.expect(result).to.be.false;
        });
        it('was called 3 times should not verify first arg called 2 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg1], index_1.Times.exact(2));
            chai_1.expect(result).to.be.false;
        });
        it('was called 3 times should verify first arg called 2 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            testObject.callPrivateFunction(arg1);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg1], index_1.Times.exact(2));
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should verify second arg was called', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2]);
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should verify second arg was called 1 time', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(1));
            chai_1.expect(result).to.be.true;
        });
        it('was called twice should not verify second arg was called 2 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(2));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not verify second arg was called 0 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(0));
            chai_1.expect(result).to.be.false;
        });
        it('was called 3 times should not verify second arg was called 0 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(0));
            chai_1.expect(result).to.be.false;
        });
        it('was called 3 times should not verify second arg was called 1 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(1));
            chai_1.expect(result).to.be.false;
        });
        it('was called 3 times should verify second arg was called 2 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(2));
            chai_1.expect(result).to.be.true;
        });
        it('was called 3 times should not verify second arg was called 3 times', function () {
            var arg1 = {};
            var arg2 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg2], index_1.Times.exact(3));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not verify with another arg', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg3]);
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not verify with another arg was called 1 times', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg3], index_1.Times.exact(1));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should not verify with another arg was called 2 times', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg3], index_1.Times.exact(2));
            chai_1.expect(result).to.be.false;
        });
        it('was called twice should verify with another arg was called 0 times', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            testObject.callPrivateFunction(arg1);
            testObject.callPrivateFunction(arg2);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [arg3], index_1.Times.exact(0));
            chai_1.expect(result).to.be.true;
        });
        it('times returns false should return false', function () {
            var timesMole = {
                match: function () { return false; }
            };
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);
            chai_1.expect(result).to.be.false;
        });
        it('times returns true should return true', function () {
            var timesMole = {
                match: function () { return true; }
            };
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);
            chai_1.expect(result).to.be.true;
        });
        it('one argument - ItIsBase returns false should return false', function () {
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () { return false; };
            testObject.callPrivateFunction(1);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [itIs]);
            chai_1.expect(result).to.be.false;
        });
        it('one argument - ItIsBase returns false should return true', function () {
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () { return true; };
            testObject.callPrivateFunction(1);
            var result = mole.verifyPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, [itIs]);
            chai_1.expect(result).to.be.true;
        });
    });
    describe('callBase', function () {
        it('set to true after constructor should call the original function', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original getter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalGetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onGetterCalled = originalGetterWasCalled;
            testObject.getter;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalSetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onSetterCalled = originalSetterWasCalled;
            testObject.setter = 1;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original getter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalGetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onGetterOfGetterAndSetterCalled = originalGetterWasCalled;
            testObject.getterAndSetter;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original setter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalSetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onSetterOfGetterAndSetterCalled = originalSetterWasCalled;
            testObject.getterAndSetter = 1;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to false after constructor should not call the original function', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var numberOfTimesCalled = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('set to false after constructor should not call the original getters and setters', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var numberOfTimesCalled = 0;
            var shouldNotCall = function () {
                numberOfTimesCalled++;
            };
            testObject.onGetterCalled = shouldNotCall;
            testObject.onSetterCalled = shouldNotCall;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotCall;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotCall;
            testObject.getter;
            testObject.setter = 1;
            testObject.getterAndSetter;
            testObject.getterAndSetter = 1;
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('set to true should return the original function value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var result = testObject.returning1Function();
            chai_1.expect(result).to.be.equal(1);
        });
        it('set to true should return the original getter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var getterValue = {};
            testObject.getterValue = getterValue;
            var result = testObject.getter;
            chai_1.expect(result).to.be.equal(getterValue);
        });
        it('set to true should set the setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var setterValue = {};
            testObject.setter = setterValue;
            chai_1.expect(testObject.setterValue).to.be.equal(setterValue);
        });
        it('set to true should return the original getter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var getterAndSetterValue = {};
            testObject.getterAndSetterValue = getterAndSetterValue;
            var result = testObject.getterAndSetter;
            chai_1.expect(result).to.be.equal(getterAndSetterValue);
        });
        it('set to true should set the setter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var getterAndSetterValue = {};
            testObject.getterAndSetter = getterAndSetterValue;
            chai_1.expect(testObject.getterAndSetterValue).to.be.equal(getterAndSetterValue);
        });
        it('set to false should not return the original function value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var result = testObject.returning1Function();
            chai_1.expect(result).to.not.be.equal(1);
        });
        it('set to false should not return the original getter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var getterValue = {};
            testObject.getterValue = getterValue;
            var result = testObject.getter;
            chai_1.expect(result).to.not.be.equal(getterValue);
        });
        it('set to false should not set the setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var setterValue = {};
            testObject.setter = setterValue;
            chai_1.expect(testObject.setterValue).to.not.be.equal(setterValue);
        });
        it('set to false should not return the original getter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var getterAndSetterValue = {};
            testObject.getterAndSetterValue = getterAndSetterValue;
            var result = testObject.getterAndSetter;
            chai_1.expect(result).to.not.be.equal(getterAndSetterValue);
        });
        it('set to false should not set the setter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var getterAndSetterValue = {};
            testObject.getterAndSetter = getterAndSetterValue;
            chai_1.expect(testObject.getterAndSetterValue).to.not.be.equal(getterAndSetterValue);
        });
        it('set to false should return undefined', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var result = testObject.returning1Function();
            chai_1.expect(result).to.be.undefined;
        });
        it('set to false should return undefined from getters', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            testObject.getterValue = 1;
            testObject.getterAndSetterValue = 1;
            var result1 = testObject.getter;
            var result2 = testObject.getterAndSetter;
            chai_1.expect(result1).to.be.undefined;
            chai_1.expect(result2).to.be.undefined;
        });
        it('set to true after constructor should call the original function', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original getter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalGetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onGetterCalled = originalGetterWasCalled;
            testObject.getter;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalSetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onSetterCalled = originalSetterWasCalled;
            testObject.setter = 1;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original getter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalGetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onGetterOfGetterAndSetterCalled = originalGetterWasCalled;
            testObject.getterAndSetter;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to true after constructor should call the original setter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var numberOfTimesCalled = 0;
            var originalSetterWasCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.onSetterOfGetterAndSetterCalled = originalSetterWasCalled;
            testObject.getterAndSetter = 1;
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('set to false after constructor should not call the original function', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var numberOfTimesCalled = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('set to false after constructor should not call the original getters and setters', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var numberOfTimesCalled = 0;
            var shouldNotCall = function () {
                numberOfTimesCalled++;
            };
            testObject.onGetterCalled = shouldNotCall;
            testObject.onSetterCalled = shouldNotCall;
            testObject.onGetterOfGetterAndSetterCalled = shouldNotCall;
            testObject.onSetterOfGetterAndSetterCalled = shouldNotCall;
            testObject.getter;
            testObject.setter = 1;
            testObject.getterAndSetter;
            testObject.getterAndSetter = 1;
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('set to true should return the original function value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var result = testObject.returning1Function();
            chai_1.expect(result).to.be.equal(1);
        });
        it('set to true should return the original getter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var getterValue = {};
            testObject.getterValue = getterValue;
            var result = testObject.getter;
            chai_1.expect(result).to.be.equal(getterValue);
        });
        it('set to true should set the setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var setterValue = {};
            testObject.setter = setterValue;
            chai_1.expect(testObject.setterValue).to.be.equal(setterValue);
        });
        it('set to true should return the original getter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var getterAndSetterValue = {};
            testObject.getterAndSetterValue = getterAndSetterValue;
            var result = testObject.getterAndSetter;
            chai_1.expect(result).to.be.equal(getterAndSetterValue);
        });
        it('set to true should set the setter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = true;
            var getterAndSetterValue = {};
            testObject.getterAndSetter = getterAndSetterValue;
            chai_1.expect(testObject.getterAndSetterValue).to.be.equal(getterAndSetterValue);
        });
        it('set to false should not return the original function value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var result = testObject.returning1Function();
            chai_1.expect(result).to.not.be.equal(1);
        });
        it('set to false should not return the original getter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var getterValue = {};
            testObject.getterValue = getterValue;
            var result = testObject.getter;
            chai_1.expect(result).to.not.be.equal(getterValue);
        });
        it('set to false should not set the setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var setterValue = {};
            testObject.setter = setterValue;
            chai_1.expect(testObject.setterValue).to.not.be.equal(setterValue);
        });
        it('set to false should not return the original getter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var getterAndSetterValue = {};
            testObject.getterAndSetterValue = getterAndSetterValue;
            var result = testObject.getterAndSetter;
            chai_1.expect(result).to.not.be.equal(getterAndSetterValue);
        });
        it('set to false should not set the setter of getter and setter value', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var getterAndSetterValue = {};
            testObject.getterAndSetter = getterAndSetterValue;
            chai_1.expect(testObject.getterAndSetterValue).to.not.be.equal(getterAndSetterValue);
        });
        it('set to false should return undefined', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            var result = testObject.returning1Function();
            chai_1.expect(result).to.be.undefined;
        });
        it('set to false should return undefined from getters', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            mole.callBase = false;
            testObject.getterValue = 1;
            testObject.getterAndSetterValue = 1;
            var result1 = testObject.getter;
            var result2 = testObject.getterAndSetter;
            chai_1.expect(result1).to.be.undefined;
            chai_1.expect(result2).to.be.undefined;
        });
    });
    describe('setup', function () {
        describe('callback', function () {
            it('should not call callback if function is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if getter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getter; }).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if setter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.setter = 1; }).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if getter of getter and setter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if setter of getter and setter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call callback when function is called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when getter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getter; }).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.getter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when setter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.setter = 1; }).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.setter = 1;
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when getter of getter and setter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.getterAndSetter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when setter of getter and setter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.getterAndSetter = 1;
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original getter', function () {
                mole.setup(function (_) { return _.getter; }).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onGetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.getter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original setter', function () {
                mole.setup(function (_) { return _.setter = 1; }).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.setter = 1;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original getter of getter and setter', function () {
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onGetterOfGetterAndSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.getterAndSetter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original setter of getter and setter', function () {
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onSetterOfGetterAndSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.getterAndSetter = 1;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should pass the same parameters', function () {
                var arg = 1;
                var actualArg;
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(function (_arg) {
                    actualArg = _arg;
                });
                testObject.oneArgumentsFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass the same parameters 2', function () {
                var arg1 = 1;
                var arg2 = 2;
                var arg3 = 3;
                var actualArg1;
                var actualArg2;
                var actualArg3;
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); })
                    .callback(function (_arg1, _arg2, _arg3) {
                    actualArg1 = _arg1;
                    actualArg2 = _arg2;
                    actualArg3 = _arg3;
                });
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                chai_1.expect(actualArg1).to.be.equal(arg1);
                chai_1.expect(actualArg2).to.be.equal(arg2);
                chai_1.expect(actualArg3).to.be.equal(arg3);
            });
            it('should pass the same parameters to setter', function () {
                var arg = 1;
                var actualArg;
                mole.setup(function (_) { return _.setter = index_1.It.isAny(Number); }).callback(function (_arg) {
                    actualArg = arg;
                });
                testObject.setter = arg;
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass the same parameters to setter of getter and setter', function () {
                var arg = 1;
                var actualArg;
                mole.setup(function (_) { return _.getterAndSetter = index_1.It.isAny(Number); }).callback(function (_arg) {
                    actualArg = arg;
                });
                testObject.getterAndSetter = arg;
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.onGetterCalled = shouldNotHappen;
                testObject.onSetterCalled = shouldNotHappen;
                testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions 2', function () {
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.onGetterCalled = shouldNotHappen;
                testObject.onSetterCalled = shouldNotHappen;
                testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.getterAndSetter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions 3', function () {
                mole.setup(function (_) { return _.setter = 1; }).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.onGetterCalled = shouldNotHappen;
                testObject.onSetterCalled = shouldNotHappen;
                testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.setter = 1;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.getter; }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.setter = 1; }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.getterAndSetter; }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.onGetterCalled = shouldNotHappen;
                testObject.onSetterCalled = shouldNotHappen;
                testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not return the callback return value', function () {
                mole.setup(function (_) { return _.returning1Function(); }).callback(function () {
                    return {};
                });
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.undefined;
            });
            it('should call all the callbacks when function is called', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                    numberOfTimesCalled1++;
                }).callback(function () {
                    numberOfTimesCalled2++;
                }).callback(function () {
                    numberOfTimesCalled3++;
                }).callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks when function is called for getter', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.getter; }).callback(function () {
                    numberOfTimesCalled1++;
                }).callback(function () {
                    numberOfTimesCalled2++;
                }).callback(function () {
                    numberOfTimesCalled3++;
                }).callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.getter;
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks when function is called for setter', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.setter = 1; }).callback(function () {
                    numberOfTimesCalled1++;
                }).callback(function () {
                    numberOfTimesCalled2++;
                }).callback(function () {
                    numberOfTimesCalled3++;
                }).callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.setter = 1;
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks when function is called for getter of getter and setter', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () {
                    numberOfTimesCalled1++;
                }).callback(function () {
                    numberOfTimesCalled2++;
                }).callback(function () {
                    numberOfTimesCalled3++;
                }).callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.getterAndSetter;
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks when function is called for setter of getter and setter', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () {
                    numberOfTimesCalled1++;
                }).callback(function () {
                    numberOfTimesCalled2++;
                }).callback(function () {
                    numberOfTimesCalled3++;
                }).callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.getterAndSetter = 1;
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should pass teh same parameters to all the callbacks when function is called', function () {
                var arg = 12;
                var actualArg;
                var checkArgument = function (_arg) {
                    actualArg = _arg;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .callback(checkArgument)
                    .callback(checkArgument)
                    .callback(checkArgument)
                    .callback(checkArgument);
                testObject.oneArgumentsFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass teh same parameters to all the callbacks when function is called 2', function () {
                var arg1 = 11;
                var arg2 = 12;
                var arg3 = 13;
                var actualArg1;
                var actualArg2;
                var actualArg3;
                var checkArgument = function (_arg1, _arg2, _arg3) {
                    actualArg1 = _arg1;
                    actualArg2 = _arg2;
                    actualArg3 = _arg3;
                };
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); })
                    .callback(checkArgument)
                    .callback(checkArgument)
                    .callback(checkArgument)
                    .callback(checkArgument);
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                chai_1.expect(actualArg1).to.be.equal(arg1);
                chai_1.expect(actualArg2).to.be.equal(arg2);
                chai_1.expect(actualArg3).to.be.equal(arg3);
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () { });
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('should not affect verify for getter', function () {
                mole.setup(function (_) { return _.getter; }).callback(function () { });
                chai_1.expect(mole.verify(function (_) { return _.getter; }, index_1.Times.exact(0))).to.be.true;
            });
            it('should not affect verify for setter', function () {
                mole.setup(function (_) { return _.setter = 1; }).callback(function () { });
                chai_1.expect(mole.verify(function (_) { return _.setter = 1; }, index_1.Times.exact(0))).to.be.true;
            });
            it('should not affect verify for getter of getter and setter', function () {
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () { });
                chai_1.expect(mole.verify(function (_) { return _.getterAndSetter; }, index_1.Times.exact(0))).to.be.true;
            });
            it('should not affect verify for setter of getter and setter', function () {
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () { });
                chai_1.expect(mole.verify(function (_) { return _.getterAndSetter = 1; }, index_1.Times.exact(0))).to.be.true;
            });
            it('setting setter should not affect getter', function () {
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () { });
                var value = {};
                testObject.getterAndSetterValue = value;
                var result = testObject.getterAndSetter;
                chai_1.expect(result).to.be.equal(value);
            });
            it('setting getter should not affect setter', function () {
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () { });
                var value = {};
                testObject.getterAndSetter = value;
                chai_1.expect(testObject.getterAndSetterValue).to.be.equal(value);
            });
            it('calling with not matching value should call the original function', function () {
                mole.setup(function (_) { return _.oneArgumentsFunction(1); }).callback(function () { });
                var arg = {};
                var actualArg;
                testObject.onOneArgumentsFunctionCalled = function (_arg) {
                    actualArg = arg;
                };
                testObject.oneArgumentsFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('calling setter with not matching value should call the original setter', function () {
                mole.setup(function (_) { return _.setter = 1; }).callback(function () { });
                var arg = {};
                var actualArg;
                testObject.onSetterCalled = function (_arg) {
                    actualArg = arg;
                };
                testObject.setter = arg;
                chai_1.expect(actualArg).to.be.equal(arg);
            });
        });
        describe('returns', function () {
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(111);
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original getter', function () {
                mole.setup(function (_) { return _.getter; }).returns(111);
                var numberOfTimesCalled = 0;
                testObject.onGetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.getter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original getter of getter and setter', function () {
                mole.setup(function (_) { return _.getterAndSetter; }).returns(111);
                var numberOfTimesCalled = 0;
                testObject.onGetterOfGetterAndSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.getterAndSetter;
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should return the value', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.returning1Function(); }).returns(returnValue);
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should return the value for getter', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.getter; }).returns(returnValue);
                var result = testObject.getter;
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should return the value for getter and setter', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.getterAndSetter; }).returns(returnValue);
                var result = testObject.getterAndSetter;
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should return the last returns value', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setup(function (_) { return _.returning1Function(); }).returns(returnValue1);
                mole.setup(function (_) { return _.returning1Function(); }).returns(returnValue2);
                mole.setup(function (_) { return _.returning1Function(); }).returns(returnValue3);
                mole.setup(function (_) { return _.returning1Function(); }).returns(returnValue4);
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue4);
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(4);
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('setting getter should not affect setter', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.getterAndSetter; }).returns(returnValue);
                var valueToSet = {};
                testObject.getterAndSetter = valueToSet;
                chai_1.expect(testObject.getterAndSetterValue).to.be.equal(valueToSet);
            });
            it('calling with not matching argument should return the original', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.oneArgumentsFunction(1); }).returns(returnValue);
                var result = testObject.oneArgumentsFunction(2);
                chai_1.expect(result).to.not.be.equal(returnValue);
            });
        });
        describe('returnsInOrder', function () {
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returnsInOrder([111]);
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returnsInOrder([111]);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returnsInOrder([111]);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns([111]);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should return the values', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                mole.setup(function (_) { return _.returning1Function(); }).returnsInOrder([returnValue1, returnValue2, returnValue3]);
                var result1 = testObject.returning1Function();
                var result2 = testObject.returning1Function();
                var result3 = testObject.returning1Function();
                var result4 = testObject.returning1Function();
                chai_1.expect(result1).to.be.equal(returnValue1);
                chai_1.expect(result2).to.be.equal(returnValue2);
                chai_1.expect(result3).to.be.equal(returnValue3);
                chai_1.expect(result4).to.be.undefined;
            });
            it('should return the last returns values', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                var returnValue5 = {};
                var returnValue6 = {};
                var returnValue7 = {};
                mole.setup(function (_) { return _.returning1Function(); }).returns(returnValue1);
                mole.setup(function (_) { return _.returning1Function(); }).returnsInOrder([returnValue2, returnValue3, returnValue4]);
                mole.setup(function (_) { return _.returning1Function(); }).returnsInOrder([returnValue5, returnValue6, returnValue7]);
                var result1 = testObject.returning1Function();
                var result2 = testObject.returning1Function();
                var result3 = testObject.returning1Function();
                var result4 = testObject.returning1Function();
                chai_1.expect(result1).to.be.equal(returnValue5);
                chai_1.expect(result2).to.be.equal(returnValue6);
                chai_1.expect(result3).to.be.equal(returnValue7);
                chai_1.expect(result4).to.be.undefined;
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returnsInOrder([4]);
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('should return the last returns values for getter', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                var returnValue5 = {};
                var returnValue6 = {};
                var returnValue7 = {};
                mole.setup(function (_) { return _.getter; }).returns(returnValue1);
                mole.setup(function (_) { return _.getter; }).returnsInOrder([returnValue2, returnValue3, returnValue4]);
                mole.setup(function (_) { return _.getter; }).returnsInOrder([returnValue5, returnValue6, returnValue7]);
                var result1 = testObject.getter;
                var result2 = testObject.getter;
                var result3 = testObject.getter;
                var result4 = testObject.getter;
                chai_1.expect(result1).to.be.equal(returnValue5);
                chai_1.expect(result2).to.be.equal(returnValue6);
                chai_1.expect(result3).to.be.equal(returnValue7);
                chai_1.expect(result4).to.be.undefined;
            });
        });
        describe('lazyReturns', function () {
            it('should not call returnFunction if function is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call returnFunction when function is called', function () {
                var numberOfTimesCalled = 0;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () {
                    numberOfTimesCalled++;
                });
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should pass the same parameters', function () {
                var arg = 1;
                var actualArg;
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(function (_arg) {
                    actualArg = _arg;
                });
                testObject.oneArgumentsFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass the same parameters 2', function () {
                var arg1 = 1;
                var arg2 = 2;
                var arg3 = 3;
                var actualArg1;
                var actualArg2;
                var actualArg3;
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); })
                    .lazyReturns(function (_arg1, _arg2, _arg3) {
                    actualArg1 = _arg1;
                    actualArg2 = _arg2;
                    actualArg3 = _arg3;
                });
                testObject.manyArgumentsFunction(arg1, arg2, arg3);
                chai_1.expect(actualArg1).to.be.equal(arg1);
                chai_1.expect(actualArg2).to.be.equal(arg2);
                chai_1.expect(actualArg3).to.be.equal(arg3);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should return the returnFunction return value', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.returning1Function(); }).lazyReturns(function () {
                    return returnValue;
                });
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should return the last returnFunction return value', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .lazyReturns(function () { return returnValue1; })
                    .lazyReturns(function () { return returnValue2; })
                    .lazyReturns(function () { return returnValue3; })
                    .lazyReturns(function () { return returnValue4; });
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue4);
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () { return 4; });
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('should return the last returnFunction return of getter of getter and setter', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setup(function (_) { return _.getterAndSetter; })
                    .lazyReturns(function () { return returnValue1; })
                    .lazyReturns(function () { return returnValue2; })
                    .lazyReturns(function () { return returnValue3; })
                    .lazyReturns(function () { return returnValue4; });
                var result = testObject.getterAndSetter;
                chai_1.expect(result).to.be.equal(returnValue4);
            });
        });
        describe('lazyReturnsInOrder', function () {
            it('should not call returnFunction if function is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([function () {
                        numberOfTimesCalled++;
                    }]);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call returnFunction when function is called', function () {
                var functionThatWasCalled = [];
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([
                    function () { return functionThatWasCalled.push(1); },
                    function () { return functionThatWasCalled.push(2); },
                    function () { return functionThatWasCalled.push(3); }]);
                testObject.noArgumentsFunction();
                testObject.noArgumentsFunction();
                testObject.noArgumentsFunction();
                testObject.noArgumentsFunction();
                chai_1.expect(functionThatWasCalled.length).to.be.equal(3);
                chai_1.expect(functionThatWasCalled[0]).to.be.equal(1);
                chai_1.expect(functionThatWasCalled[1]).to.be.equal(2);
                chai_1.expect(functionThatWasCalled[2]).to.be.equal(3);
            });
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([function () { }]);
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should pass the same parameters', function () {
                var arg1 = 1;
                var arg2 = 2;
                var actualArg1;
                var actualArg2;
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturnsInOrder([function (_arg1) {
                        actualArg1 = _arg1;
                    }, function (_arg2) {
                        actualArg2 = _arg2;
                    }]);
                testObject.oneArgumentsFunction(arg1);
                testObject.oneArgumentsFunction(arg2);
                chai_1.expect(actualArg1).to.be.equal(arg1);
                chai_1.expect(actualArg2).to.be.equal(arg2);
            });
            it('should pass the same parameters 2', function () {
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
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); })
                    .lazyReturnsInOrder([function (_arg11, _arg12, _arg13) {
                        actualArg11 = _arg11;
                        actualArg12 = _arg12;
                        actualArg13 = _arg13;
                    }, function (_arg21, _arg22, _arg23) {
                        actualArg21 = _arg21;
                        actualArg22 = _arg22;
                        actualArg23 = _arg23;
                    }]);
                testObject.manyArgumentsFunction(arg11, arg12, arg13);
                testObject.manyArgumentsFunction(arg21, arg22, arg23);
                chai_1.expect(actualArg11).to.be.equal(arg11);
                chai_1.expect(actualArg12).to.be.equal(arg12);
                chai_1.expect(actualArg13).to.be.equal(arg13);
                chai_1.expect(actualArg21).to.be.equal(arg21);
                chai_1.expect(actualArg22).to.be.equal(arg22);
                chai_1.expect(actualArg23).to.be.equal(arg23);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([function () { }]);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([function () { }]);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([function () { }]);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.noArgumentsFunction();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should return the returnFunction return values', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                mole.setup(function (_) { return _.returning1Function(); }).lazyReturnsInOrder([
                    function () { return returnValue1; },
                    function () { return returnValue2; },
                    function () { return returnValue3; }
                ]);
                var result1 = testObject.returning1Function();
                var result2 = testObject.returning1Function();
                var result3 = testObject.returning1Function();
                var result4 = testObject.returning1Function();
                chai_1.expect(result1).to.be.equal(returnValue1);
                chai_1.expect(result2).to.be.equal(returnValue2);
                chai_1.expect(result3).to.be.equal(returnValue3);
                chai_1.expect(result4).to.be.undefined;
            });
            it('should return the last returnFunction return values', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                var returnValue5 = {};
                var returnValue6 = {};
                var returnValue7 = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .lazyReturns(function () { return returnValue1; })
                    .lazyReturns(function () { return returnValue2; })
                    .lazyReturnsInOrder([function () { return returnValue3; }, function () { return returnValue4; }])
                    .lazyReturnsInOrder([function () { return returnValue5; }, function () { return returnValue6; }, function () { return returnValue7; }]);
                var result1 = testObject.returning1Function();
                var result2 = testObject.returning1Function();
                var result3 = testObject.returning1Function();
                var result4 = testObject.returning1Function();
                chai_1.expect(result1).to.be.equal(returnValue5);
                chai_1.expect(result2).to.be.equal(returnValue6);
                chai_1.expect(result3).to.be.equal(returnValue7);
                chai_1.expect(result4).to.be.undefined;
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturnsInOrder([function () { return 4; }]);
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('should return the last returnFunction return values of getter of getter and setter', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                var returnValue5 = {};
                var returnValue6 = {};
                var returnValue7 = {};
                mole.setup(function (_) { return _.getterAndSetter; })
                    .lazyReturns(function () { return returnValue1; })
                    .lazyReturns(function () { return returnValue2; })
                    .lazyReturnsInOrder([function () { return returnValue3; }, function () { return returnValue4; }])
                    .lazyReturnsInOrder([function () { return returnValue5; }, function () { return returnValue6; }, function () { return returnValue7; }]);
                var result1 = testObject.getterAndSetter;
                var result2 = testObject.getterAndSetter;
                var result3 = testObject.getterAndSetter;
                var result4 = testObject.getterAndSetter;
                chai_1.expect(result1).to.be.equal(returnValue5);
                chai_1.expect(result2).to.be.equal(returnValue6);
                chai_1.expect(result3).to.be.equal(returnValue7);
                chai_1.expect(result4).to.be.undefined;
            });
        });
        describe('throws', function () {
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws(111);
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should throw the error', function () {
                var thrownError = {};
                mole.setup(function (_) { return _.returning1Function(); }).throws(thrownError);
                var actualError;
                try {
                    testObject.returning1Function();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should throw the last error', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var actualError;
                try {
                    testObject.returning1Function();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError4);
            });
            it('should throw the last error for getter', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.getter; })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var actualError;
                try {
                    testObject.getter;
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError4);
            });
            it('should throw the last error for setter', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.setter = 1; })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var actualError;
                try {
                    testObject.setter = 1;
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError4);
            });
            it('should throw the last error for getter of getter and setter', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.getterAndSetter; })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var actualError;
                try {
                    testObject.getterAndSetter;
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError4);
            });
            it('should throw the last error for setter of getter and setter', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.getterAndSetter = 1; })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var actualError;
                try {
                    testObject.getterAndSetter = 1;
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError4);
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws('error');
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('setting getter should not affect setter', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.getterAndSetter; })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter = 1;
                }
                catch (e) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('setting setter should not affect getter', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setup(function (_) { return _.getterAndSetter = 1; })
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter;
                }
                catch (e) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('calling setter with not matching argument should not throw', function () {
                mole.setup(function (_) { return _.setter = 1; }).throws({});
                var numberOfTimesThrown = 0;
                try {
                    testObject.setter = 2;
                }
                catch (e) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('calling setter of getter and setter with not matching argument should not throw', function () {
                mole.setup(function (_) { return _.getterAndSetter = 1; }).throws({});
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter = 2;
                }
                catch (e) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('calling function with not matching argument should not throw', function () {
                mole.setup(function (_) { return _.oneArgumentsFunction(1); }).throws({});
                var numberOfTimesThrown = 0;
                try {
                    testObject.oneArgumentsFunction(2);
                }
                catch (e) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
        });
        describe('lazyThrows', function () {
            it('should not call returnErrorFunction if function is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call returnErrorFunction when function is called', function () {
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () {
                    numberOfTimesCalled++;
                });
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call the original function', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () { });
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should pass the same parameters', function () {
                var arg = 1;
                var actualArg;
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyThrows(function (_arg) {
                    actualArg = _arg;
                });
                try {
                    testObject.oneArgumentsFunction(arg);
                }
                catch (e) {
                }
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass the same parameters 2', function () {
                var arg1 = 1;
                var arg2 = 2;
                var arg3 = 3;
                var actualArg1;
                var actualArg2;
                var actualArg3;
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); })
                    .lazyThrows(function (_arg1, _arg2, _arg3) {
                    actualArg1 = _arg1;
                    actualArg2 = _arg2;
                    actualArg3 = _arg3;
                });
                try {
                    testObject.manyArgumentsFunction(arg1, arg2, arg3);
                }
                catch (e) {
                }
                chai_1.expect(actualArg1).to.be.equal(arg1);
                chai_1.expect(actualArg2).to.be.equal(arg2);
                chai_1.expect(actualArg3).to.be.equal(arg3);
            });
            it('should not call other original functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyThrows on other functions', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should throw the returnErrorFunction error', function () {
                var error = {};
                mole.setup(function (_) { return _.returning1Function(); }).lazyThrows(function () {
                    return error;
                });
                var actualError;
                try {
                    testObject.returning1Function();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(error);
            });
            it('should throw the last returnErrorFunction error', function () {
                var error1 = {};
                var error2 = {};
                var error3 = {};
                var error4 = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .lazyThrows(function () { return error1; })
                    .lazyThrows(function () { return error2; })
                    .lazyThrows(function () { return error3; })
                    .lazyThrows(function () { return error4; });
                var actualError;
                try {
                    testObject.returning1Function();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(error4);
            });
            it('should not affect verify', function () {
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyThrows(function () { return 4; });
                chai_1.expect(mole.verify(function (_) { return _.noArgumentsFunction(); }, index_1.Times.exact(0))).to.be.true;
            });
        });
        describe('mix', function () {
            it('should throw error if configured after return', function () {
                var returnValue = {};
                var thrownError = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .returns(returnValue)
                    .throws(thrownError);
                var actualError;
                try {
                    testObject.returning1Function();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should return value if configured after throw', function () {
                var returnValue = {};
                var thrownError = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .throws(thrownError)
                    .returns(returnValue);
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should call all the callbacks and the lazy returns but return last configured one', function () {
                var returnValue = {};
                var thrownError = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.returning1Function(); })
                    .throws(thrownError)
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                    return 1;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled2++;
                    return 2;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                    return 3;
                })
                    .callback(function () { return numberOfTimesCalled4++; })
                    .returns(returnValue);
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks and the lazy returns but return last configured one 2', function () {
                var returnValue = {};
                var thrownError = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.returning1Function(); })
                    .throws(thrownError)
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                    return 1;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled2++;
                    return 2;
                })
                    .returns(3)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                    return returnValue;
                })
                    .callback(function () { return numberOfTimesCalled4++; });
                var result = testObject.returning1Function();
                chai_1.expect(result).to.be.equal(returnValue);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks and the lazy returns but throw last configured error', function () {
                var returnValue = {};
                var thrownError = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.returning1Function(); })
                    .throws('asdasd')
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                    return 1;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled2++;
                    return 2;
                })
                    .returns(returnValue)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                    return 3;
                })
                    .throws(thrownError)
                    .callback(function () { return numberOfTimesCalled4++; });
                var actualError;
                try {
                    testObject.returning1Function();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should not affect the verify', function () {
                var returnValue = {};
                var thrownError = {};
                mole.setup(function (_) { return _.returning1Function(); })
                    .throws('asdasd')
                    .lazyReturns(function () { return 1; })
                    .lazyReturns(function () { return 2; })
                    .lazyReturns(function () { return 3; })
                    .throws(thrownError)
                    .returns(returnValue)
                    .callback(function () { });
                chai_1.expect(mole.verify(function (_) { return _.returning1Function(); }, index_1.Times.exact(0))).to.be.true;
            });
            it('should call only the matching set', function () {
                var returnValue = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                var numberOfTimesCalled5 = 0;
                var numberOfTimesCalled6 = 0;
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled2++;
                });
                mole.setup(function (_) { return _.oneArgumentsFunction('aaa'); })
                    .throws('error')
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                })
                    .callback(function () {
                    numberOfTimesCalled4++;
                });
                mole.setup(function (_) { return _.oneArgumentsFunction('bbb'); })
                    .lazyReturns(function () {
                    numberOfTimesCalled5++;
                })
                    .callback(function () {
                    numberOfTimesCalled6++;
                })
                    .returns(returnValue);
                var result = testObject.oneArgumentsFunction('bbb');
                chai_1.expect(result).to.be.equal(returnValue);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled5).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled6).to.be.equal(1);
            });
            it('if both setups match should call both', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled2++;
                });
                mole.setup(function (_) { return _.oneArgumentsFunction(1); })
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.oneArgumentsFunction(1);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('if both setups match should return from the last', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .lazyReturns(function () { return 1; })
                    .returns(function () { return 2; });
                mole.setup(function (_) { return _.oneArgumentsFunction(1); })
                    .lazyReturns(function () { return 3; })
                    .returns(returnValue);
                var result = testObject.oneArgumentsFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('if both setups match should return from the last 2', function () {
                var returnValue = {};
                mole.setup(function (_) { return _.oneArgumentsFunction(1); })
                    .lazyReturns(function () { return 1; })
                    .returns(function () { return 2; });
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .lazyReturns(function () { return 3; })
                    .returns(returnValue);
                var result = testObject.oneArgumentsFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('if both setups match should throw from the last', function () {
                var thrownError = {};
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .lazyReturns(function () { return 1; })
                    .throws('error')
                    .returns(function () { return 2; });
                mole.setup(function (_) { return _.oneArgumentsFunction(1); })
                    .lazyReturns(function () { return 3; })
                    .throws(thrownError);
                var actualError;
                try {
                    testObject.oneArgumentsFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('if both setups match should throw from the last 2', function () {
                var thrownError = {};
                mole.setup(function (_) { return _.oneArgumentsFunction(1); })
                    .lazyReturns(function () { return 1; })
                    .throws('error')
                    .returns(function () { return 2; });
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); })
                    .lazyReturns(function () { return 3; })
                    .throws(thrownError);
                var actualError;
                try {
                    testObject.oneArgumentsFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('setup for one object should not affect other', function () {
                var testObject1 = new TestObject_1.TestObject();
                var testObject2 = new TestObject_1.TestObject();
                var mole1 = new index_1.Mole(testObject1);
                var mole2 = new index_1.Mole(testObject2);
                var arg1 = 10;
                var returnsValue = 1;
                mole1.setup(function (_) { return _.getter; }).returns(returnsValue);
                var actualArg1;
                mole1.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(function (_arg) {
                    actualArg1 = _arg;
                });
                var arg2 = 20;
                var actualArg2;
                testObject2.onOneArgumentsFunctionCalled = function (_arg) {
                    actualArg2 = _arg;
                };
                var numberOfTimesCalled1 = 0;
                testObject1.onGetterCalled = function () {
                    numberOfTimesCalled1++;
                };
                var numberOfTimesCalled2 = 0;
                testObject2.onGetterCalled = function () {
                    numberOfTimesCalled2++;
                };
                var value = {};
                testObject2.getterValue = value;
                var result1 = testObject1.getter;
                var result2 = testObject2.getter;
                testObject1.oneArgumentsFunction(arg1);
                testObject2.oneArgumentsFunction(arg2);
                chai_1.expect(result1).to.be.equal(returnsValue);
                chai_1.expect(result2).to.be.equal(value);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(actualArg1).to.be.equal(arg1);
                chai_1.expect(actualArg2).to.be.equal(arg2);
            });
        });
    });
    describe('setupPrivate', function () {
        describe('callback', function () {
            it('should not call callback if function is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if getter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if setter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if getter of geter&setter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callback if setter of geter&setter is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call callback when function is called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateFunction(null);
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when getter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateGetter();
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when setter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateSetter(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call callback when setter is called with wrong parameter', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateSetter(2);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call callback when getter of getter&setter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateGetterOfGetterAndSetter();
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should call callback when setter of getter&setter is called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateSetterOfGetterAndSetter(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call callback when setter of getter&setter is called with wrong parameter', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateSetterOfGetterAndSetter(2);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original function', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateFunction(null);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original getter', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateGetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateGetter();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original setter', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateSetter(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call the original setter if called with other argument', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateSetter(2);
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call the original getter of getter and setter', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateGetterOfGetterAndSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateGetterOfGetterAndSetter();
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call the original setter of getter and setter', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateSetterOfGetterAndSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateSetterOfGetterAndSetter(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call the original setter of getter and setter if called with other argument', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateSetterOfGetterAndSetterCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateSetterOfGetterAndSetter(2);
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should pass the same parameters', function () {
                var arg = 1;
                var actualArg;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number)).callback(function (_arg) {
                    actualArg = _arg;
                });
                testObject.callPrivateFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass the same parameters 2', function () {
                var arg1 = 2;
                var actualArg1;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 2)
                    .callback(function (_arg1) {
                    actualArg1 = _arg1;
                });
                testObject.callPrivateFunction(arg1);
                chai_1.expect(actualArg1).to.be.equal(arg1);
            });
            it('should pass the same parameters to setter', function () {
                var arg1 = 2;
                var actualArg1;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 2)
                    .callback(function (_arg1) {
                    actualArg1 = _arg1;
                });
                testObject.callPrivateSetter(arg1);
                chai_1.expect(actualArg1).to.be.equal(arg1);
            });
            it('should pass the same parameters to setter of getter&setter', function () {
                var arg1 = 2;
                var actualArg1;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 2)
                    .callback(function (_arg1) {
                    actualArg1 = _arg1;
                });
                testObject.callPrivateSetterOfGetterAndSetter(arg1);
                chai_1.expect(actualArg1).to.be.equal(arg1);
            });
            it('should not call if not matching', function () {
                var arg = 'some text';
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number)).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateFunction(arg);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call if not matching 2', function () {
                var arg1 = 3;
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 2)
                    .callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateFunction(arg1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call if not matching 3', function () {
                var arg1 = 3;
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME)
                    .callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateFunction(undefined);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call setter if not matching', function () {
                var arg = 'some text';
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, index_1.It.isAny(Number)).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateSetter(arg);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call setter of getter&setter if not matching', function () {
                var arg = 'some text';
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, index_1.It.isAny(Number)).callback(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateSetterOfGetterAndSetter(arg);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(null);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(null);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not return the callback return value', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
                    return {};
                });
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.undefined;
            });
            it('should call all the callbacks when function is called', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
                    numberOfTimesCalled1++;
                }).callback(function () {
                    numberOfTimesCalled2++;
                }).callback(function () {
                    numberOfTimesCalled3++;
                }).callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should pass the same parameters to all the callbacks when function is called', function () {
                var arg = 12;
                var actualArg;
                var checkArgument = function (_arg) {
                    actualArg = _arg;
                };
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .callback(checkArgument)
                    .callback(checkArgument)
                    .callback(checkArgument)
                    .callback(checkArgument);
                testObject.callPrivateFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
        });
        describe('returns', function () {
            it('returns - should not call the original function', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);
                var numberOfTimesCalled = 0;
                testObject.onPrivateFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('returns - should not call other original functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('returns - should not call callbacks on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('returns - should not call lazyReturns on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('returns - should return the value', function () {
                var returnValue = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue);
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('returns - should return the last returns value', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue1);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue2);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue3);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue4);
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue4);
            });
            it('returns - should return the last getter value', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).returns(returnValue1);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).returns(returnValue2);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).returns(returnValue3);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).returns(returnValue4);
                var result = testObject.callPrivateGetter();
                chai_1.expect(result).to.be.equal(returnValue4);
            });
            it('returns - should return the last getter of getter and setter value', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue1);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue2);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue3);
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue4);
                var result = testObject.callPrivateGetterOfGetterAndSetter();
                chai_1.expect(result).to.be.equal(returnValue4);
            });
        });
        describe('lazyReturns', function () {
            it('should not call returnFunction if function is not called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
                    numberOfTimesCalled++;
                });
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should call returnFunction when function is called', function () {
                var numberOfTimesCalled = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
                    numberOfTimesCalled++;
                });
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
            });
            it('should not call the original function', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                testObject.onPrivateFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should pass the same parameters', function () {
                var arg = 1;
                var actualArg;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number)).lazyReturns(function (_arg) {
                    actualArg = _arg;
                });
                testObject.callPrivateFunction(arg);
                chai_1.expect(actualArg).to.be.equal(arg);
            });
            it('should pass the same parameters 2', function () {
                var arg1 = 1;
                var actualArg1;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, arg1)
                    .lazyReturns(function (_arg1, _arg2, _arg3) {
                    actualArg1 = _arg1;
                });
                testObject.callPrivateFunction(arg1);
                chai_1.expect(actualArg1).to.be.equal(arg1);
            });
            it('should not call other original functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () { });
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should return the returnFunction return value', function () {
                var returnValue = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
                    return returnValue;
                });
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should return the last returnFunction return value', function () {
                var returnValue1 = {};
                var returnValue2 = {};
                var returnValue3 = {};
                var returnValue4 = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .lazyReturns(function () { return returnValue1; })
                    .lazyReturns(function () { return returnValue2; })
                    .lazyReturns(function () { return returnValue3; })
                    .lazyReturns(function () { return returnValue4; });
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue4);
            });
            it('setup getter should not affect setter', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME)
                    .lazyReturns(function () { return 1; });
                var value = {};
                testObject.callPrivateSetterOfGetterAndSetter(value);
                chai_1.expect(testObject.privateGetterAndSetterValue).to.be.equal(value);
            });
        });
        describe('throws', function () {
            it('should not call the original function', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);
                var numberOfTimesCalled = 0;
                testObject.onNoArgumentsFunctionCalled = function () {
                    numberOfTimesCalled++;
                };
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call other original functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call callbacks on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).callback(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should not call lazyReturns on other functions', function () {
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);
                var numberOfTimesCalled = 0;
                var shouldNotHappen = function () {
                    numberOfTimesCalled++;
                };
                mole.setup(function (_) { return _.oneArgumentsFunction(index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                mole.setup(function (_) { return _.manyArgumentsFunction(index_1.It.isAny(Number), index_1.It.isAny(Number), index_1.It.isAny(Number)); }).lazyReturns(shouldNotHappen);
                testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
                testObject.manyArgumentsFunction = shouldNotHappen;
                testObject.oneArgumentsFunction = shouldNotHappen;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (e) {
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            });
            it('should throw the error', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should throw the error for getter', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_NAME).throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateGetter();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should throw the error for setter', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateSetter(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should not throw the error for setter if arguments dont match', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);
                var numberOfTimesThrown = 0;
                try {
                    testObject.callPrivateSetter(2);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('should throw the error for getter of getter&setter', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateGetterOfGetterAndSetter();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should throw the error for setter of getter&setter', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateSetterOfGetterAndSetter(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should not throw the error for setter of getter&setter if arguments dont match', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);
                var numberOfTimesThrown = 0;
                try {
                    testObject.callPrivateSetterOfGetterAndSetter(2);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('setup getter should not throw on setter', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);
                var numberOfTimesThrown = 0;
                try {
                    testObject.callPrivateSetterOfGetterAndSetter(2);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('setup setter should not throw on getter', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);
                var numberOfTimesThrown = 0;
                try {
                    testObject.callPrivateGetterOfGetterAndSetter();
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('should throw the last error', function () {
                var thrownError1 = {};
                var thrownError2 = {};
                var thrownError3 = {};
                var thrownError4 = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .throws(thrownError1)
                    .throws(thrownError2)
                    .throws(thrownError3)
                    .throws(thrownError4);
                var actualError;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError4);
            });
        });
        describe('mix', function () {
            it('should throw error if configured after return', function () {
                var returnValue = {};
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .returns(returnValue)
                    .throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should return value if configured after throw', function () {
                var returnValue = {};
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .throws(thrownError)
                    .returns(returnValue);
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('should call all the callbacks and the lazy returns but return last configured one', function () {
                var returnValue = {};
                var thrownError = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .throws(thrownError)
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                    return 1;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled2++;
                    return 2;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                    return 3;
                })
                    .callback(function () { return numberOfTimesCalled4++; })
                    .returns(returnValue);
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks and the lazy returns but return last configured one 2', function () {
                var returnValue = {};
                var thrownError = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .throws(thrownError)
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                    return 1;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled2++;
                    return 2;
                })
                    .returns(3)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                    return returnValue;
                })
                    .callback(function () { return numberOfTimesCalled4++; });
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('should call all the callbacks and the lazy returns but throw last configured error', function () {
                var returnValue = {};
                var thrownError = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .throws('asdasd')
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                    return 1;
                })
                    .lazyReturns(function () {
                    numberOfTimesCalled2++;
                    return 2;
                })
                    .returns(returnValue)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                    return 3;
                })
                    .throws(thrownError)
                    .callback(function () { return numberOfTimesCalled4++; });
                var actualError;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('should call only the matching set', function () {
                var returnValue = {};
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                var numberOfTimesCalled5 = 0;
                var numberOfTimesCalled6 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled2++;
                });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 'aaa')
                    .throws('error')
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                })
                    .callback(function () {
                    numberOfTimesCalled4++;
                });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 'bbb')
                    .lazyReturns(function () {
                    numberOfTimesCalled5++;
                })
                    .callback(function () {
                    numberOfTimesCalled6++;
                })
                    .returns(returnValue);
                var result = testObject.callPrivateFunction('bbb');
                chai_1.expect(result).to.be.equal(returnValue);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(0);
                chai_1.expect(numberOfTimesCalled5).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled6).to.be.equal(1);
            });
            it('if both setups match should call both', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled2++;
                });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.callPrivateFunction(1);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('if both setups match should call both for setter', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled2++;
                });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_SETTER_NAME, 1)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.callPrivateSetter(1);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('if both setups match should call both for setter of getter and setter', function () {
                var numberOfTimesCalled1 = 0;
                var numberOfTimesCalled2 = 0;
                var numberOfTimesCalled3 = 0;
                var numberOfTimesCalled4 = 0;
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () {
                    numberOfTimesCalled1++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled2++;
                });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1)
                    .lazyReturns(function () {
                    numberOfTimesCalled3++;
                })
                    .returns('return value')
                    .callback(function () {
                    numberOfTimesCalled4++;
                });
                testObject.callPrivateSetterOfGetterAndSetter(1);
                chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled3).to.be.equal(1);
                chai_1.expect(numberOfTimesCalled4).to.be.equal(1);
            });
            it('if both setups match should return from the last', function () {
                var returnValue = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () { return 1; })
                    .returns(function () { return 2; });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .lazyReturns(function () { return 3; })
                    .returns(returnValue);
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('if both setups match should return from the last 2', function () {
                var returnValue = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .lazyReturns(function () { return 1; })
                    .returns(function () { return 2; });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () { return 3; })
                    .returns(returnValue);
                var result = testObject.callPrivateFunction(1);
                chai_1.expect(result).to.be.equal(returnValue);
            });
            it('if both setups match should throw from the last', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () { return 1; })
                    .throws('error')
                    .returns(function () { return 2; });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .lazyReturns(function () { return 3; })
                    .throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
            it('if both setups match should throw from the last 2', function () {
                var thrownError = {};
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, 1)
                    .lazyReturns(function () { return 1; })
                    .throws('error')
                    .returns(function () { return 2; });
                mole.setupPrivate(TestObject_1.TestObject.PRIVATE_FUNCTION_NAME, index_1.It.isAny(Number))
                    .lazyReturns(function () { return 3; })
                    .throws(thrownError);
                var actualError;
                try {
                    testObject.callPrivateFunction(1);
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
        });
    });
    describe('isStrict', function () {
        describe('true', function () {
            it('isStrict - true - no setup should throw error', function () {
                mole.isStrict = true;
                var numberOfTimesThrown = 0;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - no setup for getter should throw error', function () {
                mole.isStrict = true;
                var numberOfTimesThrown = 0;
                try {
                    testObject.getter;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - no setup for setter should throw error', function () {
                mole.isStrict = true;
                var numberOfTimesThrown = 0;
                try {
                    testObject.setter = 1;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - no setup for getter of getter and setter should throw error', function () {
                mole.isStrict = true;
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - no setup for setter of getter and setter should throw error', function () {
                mole.isStrict = true;
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter = 1;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - has callback setup should call the callback and not throw error', function () {
                mole.isStrict = true;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                    numberOfTimesCalled++;
                });
                var numberOfTimesThrown = 0;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - getter has callback setup should call the callback and not throw error', function () {
                mole.isStrict = true;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getter; }).callback(function () {
                    numberOfTimesCalled++;
                });
                var numberOfTimesThrown = 0;
                try {
                    testObject.getter;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - setter has callback setup should call the callback and not throw error', function () {
                mole.isStrict = true;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.setter = 1; }).callback(function () {
                    numberOfTimesCalled++;
                });
                var numberOfTimesThrown = 0;
                try {
                    testObject.setter = 1;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - getter of getter&setter has callback setup should call the callback and not throw error', function () {
                mole.isStrict = true;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getterAndSetter; }).callback(function () {
                    numberOfTimesCalled++;
                });
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - setter of getter&setter has callback setup should call the callback and not throw error', function () {
                mole.isStrict = true;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () {
                    numberOfTimesCalled++;
                });
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter = 1;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - has callback setup  for other argument should throw error', function () {
                mole.isStrict = true;
                mole.setup(function (_) { return _.oneArgumentsFunction(1); }).callback(function () { });
                var numberOfTimesThrown = 0;
                try {
                    testObject.oneArgumentsFunction(2);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - setter has callback setup for other argument should throw error', function () {
                mole.isStrict = true;
                mole.setup(function (_) { return _.setter = 1; }).callback(function () { });
                var numberOfTimesThrown = 0;
                try {
                    testObject.setter = 2;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - setter of getter&setter has callback setup for other argument should throw error', function () {
                mole.isStrict = true;
                mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () { });
                var numberOfTimesThrown = 0;
                try {
                    testObject.getterAndSetter = 2;
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(1);
            });
            it('isStrict - true - has lazyReturns setup should call the lazyReturns and not throw error', function () {
                mole.isStrict = true;
                var returnValue = {};
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () {
                    numberOfTimesCalled++;
                    return returnValue;
                });
                var numberOfTimesThrown = 0;
                try {
                    var result = testObject.noArgumentsFunction();
                    chai_1.expect(result).to.be.equal(returnValue);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - has returns setup should return the returnValue and not throw error', function () {
                mole.isStrict = true;
                var returnValue = {};
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(returnValue);
                var numberOfTimesThrown = 0;
                try {
                    var result = testObject.noArgumentsFunction();
                    chai_1.expect(result).to.be.equal(returnValue);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - true - has throws setup should throw the thrownError', function () {
                mole.isStrict = true;
                var thrownError = {};
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws(thrownError);
                var actualError;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
        });
        describe('false', function () {
            it('isStrict - false - no setup should not throw error', function () {
                mole.isStrict = false;
                var numberOfTimesThrown = 0;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - false - has callbeck setup should call the callback and not throw error', function () {
                mole.isStrict = false;
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                    numberOfTimesCalled++;
                });
                var numberOfTimesThrown = 0;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - false - has lazyReturns setup should call the lazyReturns and not throw error', function () {
                mole.isStrict = false;
                var returnValue = {};
                var numberOfTimesCalled = 0;
                mole.setup(function (_) { return _.noArgumentsFunction(); }).lazyReturns(function () {
                    numberOfTimesCalled++;
                    return returnValue;
                });
                var numberOfTimesThrown = 0;
                try {
                    var result = testObject.noArgumentsFunction();
                    chai_1.expect(result).to.be.equal(returnValue);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesCalled).to.be.equal(1);
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - false - has returns setup should return the returnValue and not throw error', function () {
                mole.isStrict = false;
                var returnValue = {};
                mole.setup(function (_) { return _.noArgumentsFunction(); }).returns(returnValue);
                var numberOfTimesThrown = 0;
                try {
                    var result = testObject.noArgumentsFunction();
                    chai_1.expect(result).to.be.equal(returnValue);
                }
                catch (error) {
                    numberOfTimesThrown++;
                }
                chai_1.expect(numberOfTimesThrown).to.be.equal(0);
            });
            it('isStrict - false - has throws setup should throw the thrownError', function () {
                mole.isStrict = false;
                var thrownError = {};
                mole.setup(function (_) { return _.noArgumentsFunction(); }).throws(thrownError);
                var actualError;
                try {
                    testObject.noArgumentsFunction();
                }
                catch (error) {
                    actualError = error;
                }
                chai_1.expect(actualError).to.be.equal(thrownError);
            });
        });
    });
    describe('staticFunction', function () {
        it('Override static function', function () {
            var mole = new index_1.Mole(TestObject_1.TestObject);
            var numberOfTimesCalled = 0;
            mole.setup(function (_) { TestObject_1.TestObject.staticFunction(); }).callback(function () {
                numberOfTimesCalled++;
            });
            TestObject_1.TestObject.staticFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
    });
    describe('setup', function () {
        it('inheritence - callback on sons function should call callback', function () {
            var testObjectSon = new TestObjectSon_1.TestObjectSon();
            var mole = new index_1.Mole(testObjectSon);
            var numberOfTimesCalled = 0;
            mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                numberOfTimesCalled++;
            });
            testObjectSon.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
    });
    describe('dispose', function () {
        it('before dispose should not call the original function', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                numberOfTimesCalled2++;
            });
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
        });
        it('before dispose should not call the original getter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onGetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.getter; }).callback(function () {
                numberOfTimesCalled2++;
            });
            testObject.getter;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
        });
        it('before dispose should not call the original setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onSetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.setter = 1; }).callback(function () {
                numberOfTimesCalled2++;
            });
            testObject.setter = 1;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
        });
        it('before dispose should not call the original getter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onGetterOfGetterAndSetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.getterAndSetter; }).callback(function () {
                numberOfTimesCalled2++;
            });
            testObject.getterAndSetter;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
        });
        it('before dispose should not call the original setter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onSetterOfGetterAndSetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () {
                numberOfTimesCalled2++;
            });
            testObject.getterAndSetter = 1;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(0);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(1);
        });
        it('should call the original function', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.noArgumentsFunction(); }).callback(function () {
                numberOfTimesCalled2++;
            });
            mole.dispose();
            testObject.noArgumentsFunction();
            chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
        });
        it('should call the original getter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onGetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.getter; }).callback(function () {
                numberOfTimesCalled2++;
            });
            mole.dispose();
            testObject.getter;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
        });
        it('should call the original setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onSetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.setter = 1; }).callback(function () {
                numberOfTimesCalled2++;
            });
            mole.dispose();
            testObject.setter = 1;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
        });
        it('should call the original getter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onGetterOfGetterAndSetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.getterAndSetter; }).callback(function () {
                numberOfTimesCalled2++;
            });
            mole.dispose();
            testObject.getterAndSetter;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
        });
        it('should call the original setter of getter and setter', function () {
            var testObject = new TestObject_1.TestObject();
            var mole = new index_1.Mole(testObject);
            var numberOfTimesCalled1 = 0;
            testObject.onSetterOfGetterAndSetterCalled = function () {
                numberOfTimesCalled1++;
            };
            var numberOfTimesCalled2 = 0;
            mole.setup(function (_) { return _.getterAndSetter = 1; }).callback(function () {
                numberOfTimesCalled2++;
            });
            mole.dispose();
            testObject.getterAndSetter = 1;
            chai_1.expect(numberOfTimesCalled1).to.be.equal(1);
            chai_1.expect(numberOfTimesCalled2).to.be.equal(0);
        });
    });
    describe('findMoleByObject', function () {
        it('if null should return null', function () {
            var result = index_1.Mole.findMoleByObject(null);
            chai_1.expect(result).to.be.null;
        });
        it('if undefined should return null', function () {
            var result = index_1.Mole.findMoleByObject(undefined);
            chai_1.expect(result).to.be.null;
        });
        it('object without mole should return null', function () {
            var result = index_1.Mole.findMoleByObject({});
            chai_1.expect(result).to.be.null;
        });
        it('object with mole should return the mole', function () {
            var result = index_1.Mole.findMoleByObject(testObject);
            chai_1.expect(result).to.be.equal(mole);
        });
        it('objects with moles should return correct moles', function () {
            var obj1 = {};
            var obj2 = {};
            var mole1 = new index_1.Mole(obj1);
            var mole2 = new index_1.Mole(obj2);
            var result1 = index_1.Mole.findMoleByObject(obj1);
            var result2 = index_1.Mole.findMoleByObject(obj2);
            var result3 = index_1.Mole.findMoleByObject(testObject);
            chai_1.expect(result1).to.be.equal(mole1);
            chai_1.expect(result2).to.be.equal(mole2);
            chai_1.expect(result3).to.be.equal(mole);
        });
        it('after dispose on mole should not return the mole for the object', function () {
            var obj1 = {};
            var obj2 = {};
            var obj3 = {};
            var mole1 = new index_1.Mole(obj1);
            var mole2 = new index_1.Mole(obj2);
            mole2.dispose();
            var mole3 = new index_1.Mole(obj3);
            var result1 = index_1.Mole.findMoleByObject(obj1);
            var result2 = index_1.Mole.findMoleByObject(obj2);
            var result3 = index_1.Mole.findMoleByObject(testObject);
            var result4 = index_1.Mole.findMoleByObject(obj3);
            chai_1.expect(result1).to.be.equal(mole1);
            chai_1.expect(result2).to.be.null;
            chai_1.expect(result3).to.be.equal(mole);
            chai_1.expect(result4).to.be.equal(mole3);
        });
    });
    describe('moleReturnValue', function () {
        it('should be false', function () {
            chai_1.expect(mole.moleReturnValue).to.be.false;
        });
        it('should not create mole of the return value by default', function () {
            var result = testObject.complexReturnFunction();
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(objectMole).to.be.null;
        });
        it('set to false should not create mole of the return value', function () {
            mole.moleReturnValue = false;
            var result = testObject.complexReturnFunction();
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(mole.moleReturnValue).to.be.false;
            chai_1.expect(objectMole).to.be.null;
        });
        it('set to true should create mole for the return value', function () {
            mole.moleReturnValue = true;
            var result = testObject.complexReturnFunction();
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(mole.moleReturnValue).to.be.true;
            chai_1.expect(objectMole).to.not.be.null;
        });
        it('set to true should create new mole for the return value', function () {
            mole.moleReturnValue = true;
            var returnValue = testObject.complexReturnFunction();
            var objectMole = index_1.Mole.findMoleByObject(returnValue);
            objectMole.setup(function (_) { return _.returning1Function(); }).returns(2);
            var result1 = testObject.returning1Function();
            var result2 = returnValue.returning1Function();
            chai_1.expect(result1).to.be.equal(1);
            chai_1.expect(result2).to.be.equal(2);
        });
        it('set to true should create mole for the return value return value', function () {
            mole.moleReturnValue = true;
            var result = testObject.complexReturnFunction().complexReturnFunction();
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(mole.moleReturnValue).to.be.true;
            chai_1.expect(objectMole).to.not.be.null;
        });
        it('set to true should create new mole for the return value return value', function () {
            mole.moleReturnValue = true;
            var returnValue = testObject.complexReturnFunction().complexReturnFunction();
            var objectMole = index_1.Mole.findMoleByObject(returnValue);
            objectMole.setup(function (_) { return _.returning1Function(); }).returns(2);
            var result1 = testObject.returning1Function();
            var result2 = returnValue.returning1Function();
            chai_1.expect(result1).to.be.equal(1);
            chai_1.expect(result2).to.be.equal(2);
        });
        it('set to false should not create mole of the return value', function () {
            mole.moleReturnValue = false;
            var result = testObject.complexGetterFunction;
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(mole.moleReturnValue).to.be.false;
            chai_1.expect(objectMole).to.be.null;
        });
        it('set to true should create mole for the return value', function () {
            mole.moleReturnValue = true;
            var result = testObject.complexGetterFunction;
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(mole.moleReturnValue).to.be.true;
            chai_1.expect(objectMole).to.not.be.null;
        });
        it('set to true should create new mole for the return value', function () {
            mole.moleReturnValue = true;
            var returnValue = testObject.complexGetterFunction;
            var objectMole = index_1.Mole.findMoleByObject(returnValue);
            objectMole.setup(function (_) { return _.returning1Function(); }).returns(2);
            var result1 = testObject.returning1Function();
            var result2 = returnValue.returning1Function();
            chai_1.expect(result1).to.be.equal(1);
            chai_1.expect(result2).to.be.equal(2);
        });
        it('set to true should create mole for the return value return value', function () {
            mole.moleReturnValue = true;
            var result = testObject.complexGetterFunction.complexGetterFunction;
            var objectMole = index_1.Mole.findMoleByObject(result);
            chai_1.expect(mole.moleReturnValue).to.be.true;
            chai_1.expect(objectMole).to.not.be.null;
        });
        it('set to true should create new mole for the return value return value', function () {
            mole.moleReturnValue = true;
            var returnValue = testObject.complexGetterFunction.complexGetterFunction;
            var objectMole = index_1.Mole.findMoleByObject(returnValue);
            objectMole.setup(function (_) { return _.returning1Function(); }).returns(2);
            var result1 = testObject.returning1Function();
            var result2 = returnValue.returning1Function();
            chai_1.expect(result1).to.be.equal(1);
            chai_1.expect(result2).to.be.equal(2);
        });
    });
});
