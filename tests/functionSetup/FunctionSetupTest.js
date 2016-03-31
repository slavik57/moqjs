"use strict";
var chai_1 = require('chai');
var TestObject_1 = require('../testsCommon/TestObject');
var FunctionProxyConfigurations_1 = require('../../src/functionProxy/FunctionProxyConfigurations');
var FunctionSetup_1 = require('../../src/functionSetup/FunctionSetup');
var ReturnsOverrideFunctionCallMode_1 = require('../../src/functionCallMode/ReturnsOverrideFunctionCallMode');
var OverrideFunctionCallMode_1 = require('../../src/functionCallMode/OverrideFunctionCallMode');
var InvokeFunctionCallMode_1 = require('../../src/functionCallMode/InvokeFunctionCallMode');
var CallbackOverrideFunctionCallMode_1 = require('../../src/functionCallMode/CallbackOverrideFunctionCallMode');
var ThrowsOverrideFunctionCallMode_1 = require('../../src/functionCallMode/ThrowsOverrideFunctionCallMode');
describe('FunctionSetup', function () {
    var argument;
    var testObject;
    var functionProxyConfigurations;
    var oneArgumentFunctionSetup;
    var returning1FunctionSetup;
    beforeEach(function () {
        argument = {};
        testObject = new TestObject_1.TestObject();
        functionProxyConfigurations = new FunctionProxyConfigurations_1.FunctionProxyConfigurations();
        oneArgumentFunctionSetup = new FunctionSetup_1.FunctionSetup(function (object) { return object.oneArgumentsFunction(argument); }, testObject, functionProxyConfigurations);
        returning1FunctionSetup = new FunctionSetup_1.FunctionSetup(function (object) { return object.returning1Function(); }, testObject, functionProxyConfigurations);
    });
    describe('constructor', function () {
        it('should initialize correctly', function () {
            var testObject = new TestObject_1.TestObject();
            var functionCall = function (object) { return object.returning1Function(); };
            var functionProxyConfigurations = new FunctionProxyConfigurations_1.FunctionProxyConfigurations();
            var functionSetup = new FunctionSetup_1.FunctionSetup(functionCall, testObject, functionProxyConfigurations);
            chai_1.expect(functionSetup.object).to.be.equal(testObject);
            chai_1.expect(functionSetup.functionCall).to.be.equal(functionCall);
            chai_1.expect(functionSetup.functionProxyConfigurations).to.be.equal(functionProxyConfigurations);
        });
    });
    describe('returns', function () {
        it('should call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            returning1FunctionSetup.returns(4);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('should call when the override type is returns', function () {
            var newReturnValue = {};
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.returns(newReturnValue);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode);
        });
        it('should call when the override contains function that returns the new value', function () {
            var newReturnValue = {};
            var actualResult;
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult = functionCallMode.override();
            };
            returning1FunctionSetup.returns(newReturnValue);
            chai_1.expect(actualResult).to.be.equal(newReturnValue);
        });
        it('should call when the override contains function that returns the new value 2', function () {
            var newReturnValue = {};
            var actualResult;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult = functionCallMode.override();
            };
            oneArgumentFunctionSetup.returns(newReturnValue);
            chai_1.expect(actualResult).to.be.equal(newReturnValue);
        });
        it('should not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var newReturnValue = {};
            oneArgumentFunctionSetup.returns(newReturnValue);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should call functionCall with same parameter', function () {
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            oneArgumentFunctionSetup.returns(4);
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('after returns functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.returns(4);
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
        it('should return the same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.returns(4);
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
    });
    describe('returnsInOrder', function () {
        it('should call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            returning1FunctionSetup.returnsInOrder([4, 5]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('should call when the override type is returns', function () {
            var newReturnValue1 = {};
            var newReturnValue2 = {};
            var newReturnValue3 = {};
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
            chai_1.expect(actualFunctionCallMode).to.be.equal(ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode);
        });
        it('should call when the override contains function that returns the new values', function () {
            var newReturnValue1 = {};
            var newReturnValue2 = {};
            var newReturnValue3 = {};
            var actualResult1;
            var actualResult2;
            var actualResult3;
            var actualResult4;
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult1 = functionCallMode.override();
                actualResult2 = functionCallMode.override();
                actualResult3 = functionCallMode.override();
                actualResult4 = functionCallMode.override();
            };
            returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
            chai_1.expect(actualResult1).to.be.equal(newReturnValue1);
            chai_1.expect(actualResult2).to.be.equal(newReturnValue2);
            chai_1.expect(actualResult3).to.be.equal(newReturnValue3);
            chai_1.expect(actualResult4).to.be.equal(undefined);
        });
        it('should call when the override contains function that returns the new values 2', function () {
            var newReturnValue1 = {};
            var newReturnValue2 = {};
            var newReturnValue3 = {};
            var actualResult1;
            var actualResult2;
            var actualResult3;
            var actualResult4;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult1 = functionCallMode.override();
                actualResult2 = functionCallMode.override();
                actualResult3 = functionCallMode.override();
                actualResult4 = functionCallMode.override();
            };
            oneArgumentFunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
            chai_1.expect(actualResult1).to.be.equal(newReturnValue1);
            chai_1.expect(actualResult2).to.be.equal(newReturnValue2);
            chai_1.expect(actualResult3).to.be.equal(newReturnValue3);
            chai_1.expect(actualResult4).to.be.equal(undefined);
        });
        it('should not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var newReturnValue = {};
            oneArgumentFunctionSetup.returnsInOrder([newReturnValue]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should call functionCall with same parameter', function () {
            var actualArg = 0;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            oneArgumentFunctionSetup.returnsInOrder([4]);
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('after returns functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.returnsInOrder([4]);
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
        it('should return the same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.returnsInOrder([4]);
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
    });
    describe('lazyReturns', function () {
        it('lazyshould call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            returning1FunctionSetup.lazyReturns(function () { return 4; });
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('lazyshould call when the functionCallMode is OverrideFunctionCallMode', function () {
            var returnValue = {};
            var returnFunction = function () {
                return returnValue;
            };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.lazyReturns(returnFunction);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode_1.OverrideFunctionCallMode);
        });
        it('lazyshould call when the override type is returns', function () {
            var returnValue = {};
            var returnFunction = function () {
                return returnValue;
            };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.lazyReturns(returnFunction);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode);
        });
        it('lazyshould call when the override contains function that returns the new value', function () {
            var returnValue = {};
            var returnFunction = function () {
                return returnValue;
            };
            var actualResult;
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult = functionCallMode.override();
            };
            returning1FunctionSetup.lazyReturns(returnFunction);
            chai_1.expect(actualResult).to.be.equal(returnValue);
        });
        it('lazyshould call when the override contains function that returns the new value 2', function () {
            var newReturnValue = {};
            var returnFunction = function () {
                return newReturnValue;
            };
            var actualResult;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult = functionCallMode.override();
            };
            oneArgumentFunctionSetup.lazyReturns(returnFunction);
            chai_1.expect(actualResult).to.be.equal(newReturnValue);
        });
        it('lazyshould not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var returnFrunction = function () { };
            oneArgumentFunctionSetup.lazyReturns(returnFrunction);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('lazyshould call functionCall with same parameter', function () {
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            oneArgumentFunctionSetup.lazyReturns(function () { return 4; });
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('lazyafter returns functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.lazyReturns(function () { return 4; });
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
        it('lazyshould return same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.lazyReturns(function () { return 4; });
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
    });
    describe('lazyReturnsInOrder', function () {
        it('lazyshould call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            returning1FunctionSetup.lazyReturnsInOrder([function () { return 4; }, function () { return 5; }]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('lazyshould call when the functionCallMode is OverrideFunctionCallMode', function () {
            var returnValue = {};
            var returnFunction = function () {
                return returnValue;
            };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode_1.OverrideFunctionCallMode);
        });
        it('lazyshould call when the override type is returns', function () {
            var returnValue = {};
            var returnFunction = function () {
                return returnValue;
            };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode);
        });
        it('lazyshould call when the override contains function that returns the new values', function () {
            var returnValue1 = {};
            var returnValue2 = {};
            var returnValue3 = {};
            var returnFunction1 = function () {
                return returnValue1;
            };
            var returnFunction2 = function () {
                return returnValue2;
            };
            var returnFunction3 = function () {
                return returnValue3;
            };
            var actualResult1;
            var actualResult2;
            var actualResult3;
            var actualResult4;
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult1 = functionCallMode.override();
                actualResult2 = functionCallMode.override();
                actualResult3 = functionCallMode.override();
                actualResult4 = functionCallMode.override();
            };
            returning1FunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);
            chai_1.expect(actualResult1).to.be.equal(returnValue1);
            chai_1.expect(actualResult2).to.be.equal(returnValue2);
            chai_1.expect(actualResult3).to.be.equal(returnValue3);
            chai_1.expect(actualResult4).to.be.equal(undefined);
        });
        it('lazyshould call when the override contains function that returns the new values 2', function () {
            var newReturnValue1 = {};
            var newReturnValue2 = {};
            var newReturnValue3 = {};
            var returnFunction1 = function () { return newReturnValue1; };
            var returnFunction2 = function () { return newReturnValue2; };
            var returnFunction3 = function () { return newReturnValue3; };
            var actualResult1;
            var actualResult2;
            var actualResult3;
            var actualResult4;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualResult1 = functionCallMode.override();
                actualResult2 = functionCallMode.override();
                actualResult3 = functionCallMode.override();
                actualResult4 = functionCallMode.override();
            };
            oneArgumentFunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);
            chai_1.expect(actualResult1).to.be.equal(newReturnValue1);
            chai_1.expect(actualResult2).to.be.equal(newReturnValue2);
            chai_1.expect(actualResult3).to.be.equal(newReturnValue3);
            chai_1.expect(actualResult4).to.be.equal(undefined);
        });
        it('lazyshould not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var returnFrunction = function () { };
            oneArgumentFunctionSetup.lazyReturnsInOrder([returnFrunction]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('lazyshould call functionCall with same parameter', function () {
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            oneArgumentFunctionSetup.lazyReturnsInOrder([function () { return 4; }]);
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('lazyafter returns functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.lazyReturnsInOrder([function () { return 4; }]);
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
        it('lazyshould return same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.lazyReturnsInOrder([function () { return 4; }]);
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
    });
    describe('callback', function () {
        it('should call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var callback = function () { };
            returning1FunctionSetup.callback(callback);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('should call when the functionCallMode type is OverrideFunctionCallMode', function () {
            var callback = function () { };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.callback(callback);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode_1.OverrideFunctionCallMode);
        });
        it('should call when the override type is Callback', function () {
            var callback = function () { };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.callback(callback);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode);
        });
        it('should call when the override contains the callback', function () {
            var numberOfTimesCalled = 0;
            var callback = function () {
                numberOfTimesCalled++;
            };
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                functionCallMode.override();
            };
            returning1FunctionSetup.callback(callback);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('should call when the override contains the callback with same parameter', function () {
            var actualArg;
            var callback = function (_arg) {
                actualArg = _arg;
            };
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                functionCallMode.override(_arg);
            };
            oneArgumentFunctionSetup.callback(callback);
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('should not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var callback = function () { };
            oneArgumentFunctionSetup.callback(callback);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should call functionCall with same parameter', function () {
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            var callback = function () { };
            oneArgumentFunctionSetup.callback(callback);
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('should return same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.callback(function () { });
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
        it('after callback functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.callback(function () { });
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
    });
    describe('throws', function () {
        it('should call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            returning1FunctionSetup.throws(4);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('should call when the functionCallMode is OverrideFunctionCallMode', function () {
            var error = {};
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.throws(error);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode_1.OverrideFunctionCallMode);
        });
        it('should call when the override type is Throws', function () {
            var error = {};
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.throws(error);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode);
        });
        it('should call when the override contains function that returns the error', function () {
            var error = {};
            var actualError;
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualError = functionCallMode.override();
            };
            returning1FunctionSetup.throws(error);
            chai_1.expect(actualError).to.be.equal(error);
        });
        it('should call when the override contains function that throws the error 2', function () {
            var error = {};
            var actualError;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualError = functionCallMode.override();
            };
            oneArgumentFunctionSetup.throws(error);
            chai_1.expect(actualError).to.be.equal(error);
        });
        it('should not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var error = {};
            oneArgumentFunctionSetup.throws(error);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should call functionCall with same parameter', function () {
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            oneArgumentFunctionSetup.throws(4);
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('after callback functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.throws({});
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
        it('should return same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.throws({});
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
    });
    describe('lazyThrows', function () {
        it('lazyshould call functionCall', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            returning1FunctionSetup.lazyThrows(function () { return 'error'; });
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('lazyshould call when the functionCallMode is OverrideFunctionCallMode', function () {
            var error = {};
            var errorReturningFunction = function () {
                return error;
            };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.lazyThrows(errorReturningFunction);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(OverrideFunctionCallMode_1.OverrideFunctionCallMode);
        });
        it('lazyshould call when the override type is throws', function () {
            var error = {};
            var errorReturningFunction = function () {
                return error;
            };
            var actualFunctionCallMode;
            testObject.onReturnung1FunctionCalled = function () {
                actualFunctionCallMode = functionProxyConfigurations.functionCallMode;
            };
            returning1FunctionSetup.lazyThrows(errorReturningFunction);
            chai_1.expect(actualFunctionCallMode).to.be.an.instanceof(ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode);
        });
        it('lazyshould call when the override contains function that returns the error', function () {
            var error = {};
            var errorReturningFunction = function () {
                return error;
            };
            var actualError;
            testObject.onReturnung1FunctionCalled = function () {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualError = functionCallMode.override();
            };
            returning1FunctionSetup.lazyThrows(errorReturningFunction);
            chai_1.expect(actualError).to.be.equal(error);
        });
        it('lazyshould call when the override contains function that throws the error 2', function () {
            var error = {};
            var errorReturningFunction = function () {
                return error;
            };
            var actualError;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                var functionCallMode = functionProxyConfigurations.functionCallMode;
                actualError = functionCallMode.override();
            };
            oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);
            chai_1.expect(actualError).to.be.equal(error);
        });
        it('lazyshould not call other function', function () {
            var numberOfTimesCalled = 0;
            testObject.onReturnung1FunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var errorReturningFunction = function () { };
            oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('lazyshould call functionCall with same parameter', function () {
            var actualArg;
            testObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArg = _arg;
            };
            oneArgumentFunctionSetup.lazyThrows(function () { return 4; });
            chai_1.expect(actualArg).to.be.equal(argument);
        });
        it('lazyafter returns functionCallMode should be InvokeFunctionCallMode', function () {
            oneArgumentFunctionSetup.lazyThrows(function () { return 4; });
            chai_1.expect(functionProxyConfigurations.functionCallMode).to.be.an.instanceof(InvokeFunctionCallMode_1.InvokeFunctionCallMode);
        });
        it('lazyshould return same function setup object', function () {
            var functionSetup = oneArgumentFunctionSetup.lazyThrows(function () { return 4; });
            chai_1.expect(functionSetup).to.be.equal(oneArgumentFunctionSetup);
        });
    });
});
