"use strict";
var chai_1 = require('chai');
var FunctionProxy_1 = require('../../src/functionProxy/FunctionProxy');
var FunctionProxyConfigurations_1 = require('../../src/functionProxy/FunctionProxyConfigurations');
var TestObject_1 = require('../testsCommon/TestObject');
var VerifyFunctionCallMode_1 = require('../../src/functionCallMode/VerifyFunctionCallMode');
var InvokeFunctionCallMode_1 = require('../../src/functionCallMode/InvokeFunctionCallMode');
var ItIsBase_1 = require('../../src/it/ItIsBase');
var CallbackOverrideFunctionCallMode_1 = require('../../src/functionCallMode/CallbackOverrideFunctionCallMode');
var It_1 = require('../../src/it/It');
var ReturnsOverrideFunctionCallMode_1 = require('../../src/functionCallMode/ReturnsOverrideFunctionCallMode');
var ThrowsOverrideFunctionCallMode_1 = require('../../src/functionCallMode/ThrowsOverrideFunctionCallMode');
describe('FunctionProxy', function () {
    var thisObject;
    var functionProxyConfigurations;
    var noArgsFunctionProxy;
    var oneArgsFunctionProxy;
    var manyArgsFunctionProxy;
    var returning1FunctionProxy;
    beforeEach(function () {
        thisObject = new TestObject_1.TestObject();
        functionProxyConfigurations = new FunctionProxyConfigurations_1.FunctionProxyConfigurations();
        noArgsFunctionProxy = new FunctionProxy_1.FunctionProxy('noArgumentsFunction', thisObject.noArgumentsFunction, thisObject, functionProxyConfigurations);
        oneArgsFunctionProxy = new FunctionProxy_1.FunctionProxy('oneArgumentsFunction', thisObject.oneArgumentsFunction, thisObject, functionProxyConfigurations);
        manyArgsFunctionProxy = new FunctionProxy_1.FunctionProxy('manyArgumentsFunction', thisObject.manyArgumentsFunction, thisObject, functionProxyConfigurations);
        returning1FunctionProxy = new FunctionProxy_1.FunctionProxy('returning1Function', thisObject.returning1Function, thisObject, functionProxyConfigurations);
    });
    function setVerifyMode() {
        var verifyFunctionCallMode = new VerifyFunctionCallMode_1.VerifyFunctionCallMode();
        functionProxyConfigurations.functionCallMode = verifyFunctionCallMode;
        return verifyFunctionCallMode;
    }
    function setInvokeMode() {
        var invokeFunctionCallMode = new InvokeFunctionCallMode_1.InvokeFunctionCallMode();
        functionProxyConfigurations.functionCallMode = invokeFunctionCallMode;
    }
    describe('constructor', function () {
        it('should initialize correctly', function () {
            var originalFunction = new Function();
            var thisObject = {};
            var functionProxyConfigurations = new FunctionProxyConfigurations_1.FunctionProxyConfigurations();
            var proxy = new FunctionProxy_1.FunctionProxy('originalFunction', originalFunction, thisObject, functionProxyConfigurations);
            chai_1.expect(proxy.thisObject).to.be.equal(thisObject);
            chai_1.expect(proxy.originalFunction).to.be.equal(originalFunction);
            chai_1.expect(proxy.functionProxyConfigurations).to.be.equal(functionProxyConfigurations);
        });
    });
    describe('callbase', function () {
        it('set to true, should call the original function', function () {
            functionProxyConfigurations.callBase = true;
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('callbase - set to false, should not call the original function', function () {
            functionProxyConfigurations.callBase = false;
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('callbase - set to false, should not return the original function result', function () {
            functionProxyConfigurations.callBase = false;
            var result = returning1FunctionProxy.callFunction([]);
            chai_1.expect(result).not.to.be.equal(1);
        });
        it('callbase - set to false, should not return undefined', function () {
            functionProxyConfigurations.callBase = false;
            var result = returning1FunctionProxy.callFunction([]);
            chai_1.expect(result).to.be.undefined;
        });
    });
    describe('callFunction - unknown mode', function () {
        it('should throw error', function () {
            var unknownFunctionCallMode = {};
            functionProxyConfigurations.functionCallMode = unknownFunctionCallMode;
            var action = function () { return noArgsFunctionProxy.callFunction([]); };
            chai_1.expect(action).to.throw();
        });
    });
    describe('callFunction - invoke mode', function () {
        it('no arguments should call only the original function', function () {
            var numberOfTimesNoArgumentsFunctionCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesNoArgumentsFunctionCalled++;
            };
            var numberOfTimesOneArgumentsFunctionCalled = 0;
            thisObject.onOneArgumentsFunctionCalled = function () {
                numberOfTimesOneArgumentsFunctionCalled++;
            };
            var numberOfTimesManyArgumentsFunctionCalled = 0;
            thisObject.onManyArgumentsFunctionCalled = function () {
                numberOfTimesManyArgumentsFunctionCalled++;
            };
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesOneArgumentsFunctionCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesManyArgumentsFunctionCalled).to.be.equal(0);
        });
        it('one arguments should call only the original function', function () {
            var arg = {};
            var numberOfTimesNoArgumentsFunctionCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesNoArgumentsFunctionCalled++;
            };
            var actualArgs = [];
            thisObject.onOneArgumentsFunctionCalled = function (_arg) {
                actualArgs.push(_arg);
            };
            var numberOfTimesManyArgumentsFunctionCalled = 0;
            thisObject.onManyArgumentsFunctionCalled = function () {
                numberOfTimesManyArgumentsFunctionCalled++;
            };
            oneArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesManyArgumentsFunctionCalled).to.be.equal(0);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0]).to.be.equal(arg);
        });
        it('many arguments should call only the original function', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            var numberOfTimesNoArgumentsFunctionCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesNoArgumentsFunctionCalled++;
            };
            var numberOfTimesOneArgumentsFunctionCalled = 0;
            thisObject.onOneArgumentsFunctionCalled = function () {
                numberOfTimesOneArgumentsFunctionCalled++;
            };
            var args = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                args.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(numberOfTimesNoArgumentsFunctionCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesOneArgumentsFunctionCalled).to.be.equal(0);
            chai_1.expect(args.length).to.be.equal(1);
            chai_1.expect(args[0].arg1).to.be.equal(arg1);
            chai_1.expect(args[0].arg2).to.be.equal(arg2);
            chai_1.expect(args[0].arg3).to.be.equal(arg3);
        });
        it('returning1Function - should return the original function result', function () {
            var result = returning1FunctionProxy.callFunction([]);
            chai_1.expect(result).to.be.equal(1);
        });
    });
    describe('callFunction - verify mode no arguments', function () {
        it('was not called should not find a match', function () {
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called should find a match', function () {
            noArgsFunctionProxy.callFunction([]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice should find a match', function () {
            noArgsFunctionProxy.callFunction([]);
            noArgsFunctionProxy.callFunction([]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(2);
        });
        it('was called with arguments should not find a match', function () {
            noArgsFunctionProxy.callFunction([{}]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called with arguments and without arguments should find a match', function () {
            noArgsFunctionProxy.callFunction([{}]);
            noArgsFunctionProxy.callFunction([]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with arguments verify with same arguments should find a match', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([arg]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with arguments verify with different arguments should not find a match', function () {
            var arg1 = {};
            var arg2 = {};
            noArgsFunctionProxy.callFunction([arg1]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg2]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
    });
    describe('callFunction - verify mode one argument', function () {
        it('was not called should not find a match', function () {
            var verifyMode = setVerifyMode();
            var arg = {};
            oneArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called should find a match', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([arg]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with IItIs which returns false, should not find a match', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([arg]);
            var verifyMode = setVerifyMode();
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                return false;
            };
            noArgsFunctionProxy.callFunction([itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called with IItIs which returns true, should f-nd a match', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([arg]);
            var verifyMode = setVerifyMode();
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                return true;
            };
            noArgsFunctionProxy.callFunction([itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice should find a match', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([arg]);
            noArgsFunctionProxy.callFunction([arg]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(2);
        });
        it('was called twice should find a match for first arg', function () {
            var arg1 = {};
            var arg2 = {};
            noArgsFunctionProxy.callFunction([arg1]);
            noArgsFunctionProxy.callFunction([arg2]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg1]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice should find a match for second arg', function () {
            var arg1 = {};
            var arg2 = {};
            noArgsFunctionProxy.callFunction([arg1]);
            noArgsFunctionProxy.callFunction([arg2]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg2]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice should not find a match for another arg', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            noArgsFunctionProxy.callFunction([arg1]);
            noArgsFunctionProxy.callFunction([arg2]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg3]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called without arguments should not find a match with arg', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called without arguments should find a match without arguments', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([]);
            var verifyMode = setVerifyMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with IItIs which returns true 3 times, should find a match', function () {
            var arg = {};
            noArgsFunctionProxy.callFunction([arg]);
            noArgsFunctionProxy.callFunction([arg]);
            noArgsFunctionProxy.callFunction([arg]);
            noArgsFunctionProxy.callFunction([arg]);
            noArgsFunctionProxy.callFunction([arg]);
            var verifyMode = setVerifyMode();
            var numberOfTimesReturnedTrue = 0;
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                numberOfTimesReturnedTrue++;
                return numberOfTimesReturnedTrue <= 3;
            };
            noArgsFunctionProxy.callFunction([itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(3);
        });
    });
    describe('callFunction - verify mode many arguments', function () {
        it('was not called should not find a match', function () {
            var verifyMode = setVerifyMode();
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called should find a match', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice should find a match', function () {
            var arg1 = {};
            var arg2 = {};
            var arg3 = {};
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(2);
        });
        it('was called twice with different sets should find a match for first set', function () {
            var argSet1 = [{}, {}, {}];
            var argSet2 = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet1);
            manyArgsFunctionProxy.callFunction(argSet2);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction(argSet1);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice with different sets should find a match for second set', function () {
            var argSet1 = [{}, {}, {}];
            var argSet2 = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet1);
            manyArgsFunctionProxy.callFunction(argSet2);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction(argSet2);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called twice with different sets should not find a match for different set', function () {
            var argSet1 = [{}, {}, {}];
            var argSet2 = [{}, {}, {}];
            var argSet3 = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet1);
            manyArgsFunctionProxy.callFunction(argSet2);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction(argSet3);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('callFunction - verify mode many arguments - was called twice with different sets should not find a match for set with one different parameter', function () {
            var argSet1 = [{}, {}, {}];
            var argSet2 = [{}, {}, {}];
            var argSet3 = [argSet1[0], argSet1[1], argSet2[2]];
            manyArgsFunctionProxy.callFunction(argSet1);
            manyArgsFunctionProxy.callFunction(argSet2);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction(argSet3);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called with less parameters should find a match', function () {
            var argSet = [{}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction(argSet);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with more parameters should find a match', function () {
            var argSet = [{}, {}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction(argSet);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with more parameters should not find a match with less parameters', function () {
            var argSet = [{}, {}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], argSet[2]]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called with ItIs that returns false should not find a match with less parameters', function () {
            var argSet = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                return false;
            };
            manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
        it('was called with ItIs that returns true should find a match with less parameters', function () {
            var argSet = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                return true;
            };
            manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with ItIs that returns true 3 times should find a match with less parameters', function () {
            var argSet = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            manyArgsFunctionProxy.callFunction(argSet);
            manyArgsFunctionProxy.callFunction(argSet);
            manyArgsFunctionProxy.callFunction(argSet);
            manyArgsFunctionProxy.callFunction(argSet);
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            var numberOfTimesReturnedTrue = 0;
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                numberOfTimesReturnedTrue++;
                return numberOfTimesReturnedTrue <= 3;
            };
            manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(3);
        });
        it('was called with 3 ItIs that returns true should find a match with less parameters', function () {
            var argSet = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            var itIs = new ItIsBase_1.ItIsBase();
            itIs.match = function () {
                return true;
            };
            manyArgsFunctionProxy.callFunction([itIs, itIs, itIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(1);
        });
        it('was called with 2 ItIs that returns true and one that returns false should find a match with less parameters', function () {
            var argSet = [{}, {}, {}];
            manyArgsFunctionProxy.callFunction(argSet);
            var verifyMode = setVerifyMode();
            var trueItIs = new ItIsBase_1.ItIsBase();
            trueItIs.match = function () {
                return true;
            };
            var falseItIs = new ItIsBase_1.ItIsBase();
            falseItIs.match = function () {
                return false;
            };
            manyArgsFunctionProxy.callFunction([trueItIs, falseItIs, trueItIs]);
            chai_1.expect(verifyMode.numberOfMatches).to.be.equal(0);
        });
    });
    describe('callFunction - override mode Callback', function () {
        it('should not call the original function', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should not call the original function with arguments', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([{}, {}, {}]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should not call the original function', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should call the override function', function () {
            var numberOfTimesCalled = 0;
            var override = function () {
                numberOfTimesCalled++;
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('calling the function should not call the override function', function () {
            var numberOfTimesCalled = 0;
            var override = function () {
                numberOfTimesCalled++;
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should call the override with same parameters', function () {
            var args = [{}, {}, {}];
            var actualArgs = [];
            var override = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction(args);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(args[0]);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(args[1]);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(args[2]);
        });
        it('invoking the function with other parameters should not call the override', function () {
            var args = [{}, {}, {}];
            var numberOfTimesCalled = 0;
            var override = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function with other parameters should call the original function', function () {
            var args1 = [{}, {}, {}];
            var args2 = [args1[0], args1[1], {}];
            var actualArgs = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var override = function () { };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args1);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction(args2);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(args2[0]);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(args2[1]);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(args2[2]);
        });
        it('calling the function with ItIs and than invoking should call the override', function () {
            var numberOfTimesManyArgumentsFunctionCalled = 0;
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                numberOfTimesManyArgumentsFunctionCalled++;
            };
            var arg1 = 1;
            var arg2 = 2;
            var arg3 = 3;
            var actualArgs = [];
            var override = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([It_1.It.isAny(Number), It_1.It.isAny(Number), arg3]);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(numberOfTimesManyArgumentsFunctionCalled).to.be.equal(0);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(arg1);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(arg2);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(arg3);
        });
        it('calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', function () {
            var actualManyArgumentsFunctionArgs = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
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
            var override = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([It_1.It.isAny(Number), It_1.It.isAny(Number), arg3]);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(actualManyArgumentsFunctionArgs.length).to.be.equal(1);
            chai_1.expect(actualManyArgumentsFunctionArgs[0].arg1).to.be.equal(arg1);
            chai_1.expect(actualManyArgumentsFunctionArgs[0].arg2).to.be.equal(arg2);
            chai_1.expect(actualManyArgumentsFunctionArgs[0].arg3).to.be.equal(arg3);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
    });
    describe('callFunction - override mode Returns', function () {
        it('should not call the original function', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should not call the original function with arguments', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([{}, {}, {}]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should not call the original function', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should call the override function', function () {
            var numberOfTimesCalled = 0;
            var override = function () {
                numberOfTimesCalled++;
            };
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('calling the function should not call the override function', function () {
            var numberOfTimesCalled = 0;
            var override = function () {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should call the override with same parameters', function () {
            var args = [{}, {}, {}];
            var actualArgs = [];
            var override = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction(args);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(args[0]);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(args[1]);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(args[2]);
        });
        it('invoking the function with other parameters should not call the override', function () {
            var args = [{}, {}, {}];
            var numberOfTimesCalled = 0;
            var override = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function with other parameters should call the original function', function () {
            var args1 = [{}, {}, {}];
            var args2 = [args1[0], args1[1], {}];
            var actualArgs = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var override = function () { };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args1);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction(args2);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(args2[0]);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(args2[1]);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(args2[2]);
        });
        it('calling the function with ItIs and than invoking should call the override', function () {
            var numberOfTimesCalled = 0;
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var arg1 = 1;
            var arg2 = 2;
            var arg3 = 3;
            var actualArgs = [];
            var override = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([It_1.It.isAny(Number), It_1.It.isAny(Number), arg3]);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(arg1);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(arg2);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(arg3);
        });
        it('calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', function () {
            var actualArgs = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
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
            var override = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([It_1.It.isAny(Number), It_1.It.isAny(Number), arg3]);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(arg1);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(arg2);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(arg3);
        });
    });
    describe('callFunction - override mode Throws', function () {
        it('should not call the original function', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('should not call the original function with arguments', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([{}, {}, {}]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should not call the original function', function () {
            var numberOfTimesCalled = 0;
            thisObject.onNoArgumentsFunctionCalled = function () {
                numberOfTimesCalled++;
            };
            var override = function () { };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            try {
                noArgsFunctionProxy.callFunction([]);
            }
            catch (e) {
            }
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should call the override function', function () {
            var numberOfTimesCalled = 0;
            var override = function () {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            try {
                noArgsFunctionProxy.callFunction([]);
            }
            catch (er) {
            }
            chai_1.expect(numberOfTimesCalled).to.be.equal(1);
        });
        it('calling the function should not call the override function', function () {
            var numberOfTimesCalled = 0;
            var override = function () {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function should call the override with same parameters', function () {
            var args = [{}, {}, {}];
            var actualArgs = [];
            var override = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args);
            setInvokeMode();
            try {
                manyArgsFunctionProxy.callFunction(args);
            }
            catch (er) {
            }
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(args[0]);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(args[1]);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(args[2]);
        });
        it('invoking the function with other parameters should not call the override', function () {
            var args = [{}, {}, {}];
            var numberOfTimesCalled = 0;
            var override = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args);
            setInvokeMode();
            try {
                manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
            }
            catch (er) {
            }
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('invoking the function with other parameters should call the original function', function () {
            var args1 = [{}, {}, {}];
            var args2 = [args1[0], args1[1], {}];
            var actualArgs = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var override = function () { };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction(args1);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction(args2);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(args2[0]);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(args2[1]);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(args2[2]);
        });
        it('calling the function with ItIs and than invoking should call the override', function () {
            var numberOfTimesCalled = 0;
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var arg1 = 1;
            var arg2 = 2;
            var arg3 = 3;
            var actualArgs = [];
            var override = function (_arg1, _arg2, _arg3) {
                actualArgs.push({
                    arg1: _arg1,
                    arg2: _arg2,
                    arg3: _arg3
                });
            };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([It_1.It.isAny(Number), It_1.It.isAny(Number), arg3]);
            setInvokeMode();
            try {
                manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            }
            catch (er) {
            }
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(arg1);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(arg2);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(arg3);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
        it('calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', function () {
            var actualArgs = [];
            thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
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
            var override = function (_arg1, _arg2, _arg3) {
                numberOfTimesCalled++;
            };
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(override);
            functionProxyConfigurations.functionCallMode = functionCallMode;
            manyArgsFunctionProxy.callFunction([It_1.It.isAny(Number), It_1.It.isAny(Number), arg3]);
            setInvokeMode();
            manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
            chai_1.expect(actualArgs.length).to.be.equal(1);
            chai_1.expect(actualArgs[0].arg1).to.be.equal(arg1);
            chai_1.expect(actualArgs[0].arg2).to.be.equal(arg2);
            chai_1.expect(actualArgs[0].arg3).to.be.equal(arg3);
            chai_1.expect(numberOfTimesCalled).to.be.equal(0);
        });
    });
    describe('callFunction - override mode mixed', function () {
        it('with ItIsAny should call all on invoke', function () {
            var error = {};
            var numberOfTimesThrowsOverrideWasCalled = 0;
            var throwsOverride = function (_arg) {
                numberOfTimesThrowsOverrideWasCalled++;
                return error;
            };
            var returnValue = {};
            var numberOfTimesReturnsValueWasCalled = 0;
            var returnsOverride = function (_arg) {
                numberOfTimesReturnsValueWasCalled++;
                return returnValue;
            };
            var numberOfTimesCallbackOVerrideWasCalled = 0;
            var callbackOverride = function (_arg) {
                numberOfTimesCallbackOVerrideWasCalled++;
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            setInvokeMode();
            oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesReturnsValueWasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(1);
        });
        it('with ItIsAny should call all on invoke with same parameter', function () {
            var arg = {};
            var error = {};
            var throwsOverrideArgs = [];
            var throwsOverride = function (_arg) {
                throwsOverrideArgs.push(_arg);
                return error;
            };
            var returnValue = {};
            var returnsOverrideArgs = [];
            var returnsOverride = function (_arg) {
                returnsOverrideArgs.push(_arg);
                return returnValue;
            };
            var callbackOverrideArgs = [];
            var callbackOverride = function (_arg) {
                callbackOverrideArgs.push(_arg);
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([arg]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([arg]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([arg]);
            setInvokeMode();
            oneArgsFunctionProxy.callFunction([arg]);
            chai_1.expect(throwsOverrideArgs.length).to.be.equal(1);
            chai_1.expect(returnsOverrideArgs.length).to.be.equal(1);
            chai_1.expect(callbackOverrideArgs.length).to.be.equal(1);
            chai_1.expect(throwsOverrideArgs[0]).to.be.equal(arg);
            chai_1.expect(returnsOverrideArgs[0]).to.be.equal(arg);
            chai_1.expect(callbackOverrideArgs[0]).to.be.equal(arg);
        });
        it('with value should call all on invoke', function () {
            var error = {};
            var numberOfTimesThrowsOverrideWasCalled = 0;
            var throwsOverride = function (_arg) {
                numberOfTimesThrowsOverrideWasCalled++;
                return error;
            };
            var returnValue = {};
            var numberOfTimesReturnsValueWasCalled = 0;
            var returnsOverride = function (_arg) {
                numberOfTimesReturnsValueWasCalled++;
                return returnValue;
            };
            var numberOfTimesCallbackOVerrideWasCalled = 0;
            var callbackOverride = function (_arg) {
                numberOfTimesCallbackOVerrideWasCalled++;
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([1]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([1]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([1]);
            setInvokeMode();
            oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesReturnsValueWasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(1);
        });
        it('with value should call only a callback on invoke', function () {
            var error = {};
            var numberOfTimesThrowsOverrideWasCalled = 0;
            var throwsOverride = function (_arg) {
                numberOfTimesThrowsOverrideWasCalled++;
                return error;
            };
            var returnValue = {};
            var numberOfTimesReturnsValueWasCalled = 0;
            var returnsOverride = function (_arg) {
                numberOfTimesReturnsValueWasCalled++;
                return returnValue;
            };
            var numberOfTimesCallbackOVerrideWasCalled = 0;
            var callbackOverride = function (_arg) {
                numberOfTimesCallbackOVerrideWasCalled++;
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([0]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([0]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([1]);
            setInvokeMode();
            oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesReturnsValueWasCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(1);
        });
        it('with value should call only a returns on invoke', function () {
            var error = {};
            var numberOfTimesThrowsOverrideWasCalled = 0;
            var throwsOverride = function (_arg) {
                numberOfTimesThrowsOverrideWasCalled++;
                return error;
            };
            var returnValue = {};
            var numberOfTimesReturnsValueWasCalled = 0;
            var returnsOverride = function (_arg) {
                numberOfTimesReturnsValueWasCalled++;
                return returnValue;
            };
            var numberOfTimesCallbackOVerrideWasCalled = 0;
            var callbackOverride = function (_arg) {
                numberOfTimesCallbackOVerrideWasCalled++;
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([0]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([1]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([0]);
            setInvokeMode();
            oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesReturnsValueWasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(0);
        });
        it('with value should call only a throws on invoke', function () {
            var error = {};
            var numberOfTimesThrowsOverrideWasCalled = 0;
            var throwsOverride = function (_arg) {
                numberOfTimesThrowsOverrideWasCalled++;
                return error;
            };
            var returnValue = {};
            var numberOfTimesReturnsValueWasCalled = 0;
            var returnsOverride = function (_arg) {
                numberOfTimesReturnsValueWasCalled++;
                return returnValue;
            };
            var numberOfTimesCallbackOVerrideWasCalled = 0;
            var callbackOverride = function (_arg) {
                numberOfTimesCallbackOVerrideWasCalled++;
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([1]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([0]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([0]);
            setInvokeMode();
            try {
                oneArgsFunctionProxy.callFunction([1]);
            }
            catch (e) {
            }
            chai_1.expect(numberOfTimesThrowsOverrideWasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesReturnsValueWasCalled).to.be.equal(0);
            chai_1.expect(numberOfTimesCallbackOVerrideWasCalled).to.be.equal(0);
        });
        it('with ItIsAny should return the return value', function () {
            var error = {};
            var throwsOverride = function (_arg) {
                return error;
            };
            var returnValue = {};
            var returnsOverride = function (_arg) {
                return returnValue;
            };
            var callbackOverride = function (_arg) {
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            setInvokeMode();
            var result = oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(result).to.be.equal(returnValue);
        });
        it('with ItIsAny should throw the error', function () {
            var error = {};
            var throwsOverride = function (_arg) {
                return error;
            };
            var returnValue = {};
            var returnsOverride = function (_arg) {
                return returnValue;
            };
            var callbackOverride = function (_arg) {
            };
            var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride);
            var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            setInvokeMode();
            var actualError;
            try {
                oneArgsFunctionProxy.callFunction([1]);
            }
            catch (err) {
                actualError = err;
            }
            chai_1.expect(actualError).to.be.equal(error);
        });
        it('with ItIsAny should throw the last error', function () {
            var error1 = {};
            var throwsOverride1 = function (_arg) {
                return error1;
            };
            var error2 = {};
            var throwsOverride2 = function (_arg) {
                return error2;
            };
            var callbackOverride = function (_arg) {
            };
            var throwsOverrideCallMode1 = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride1);
            var throwsOverrideCallMode2 = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(throwsOverride2);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            setInvokeMode();
            var actualError;
            try {
                oneArgsFunctionProxy.callFunction([1]);
            }
            catch (err) {
                actualError = err;
            }
            chai_1.expect(actualError).to.be.equal(error2);
        });
        it('with ItIsAny should return the last return value', function () {
            var returnValue1 = {};
            var returnsOverride1 = function (_arg) {
                return returnValue1;
            };
            var returnValue2 = {};
            var returnsOverride2 = function (_arg) {
                return returnValue2;
            };
            var callbackOverride = function (_arg) {
            };
            var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride1);
            var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride2);
            var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            setInvokeMode();
            var result = oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(result).to.be.equal(returnValue2);
        });
        it('with ItIsAny should call all duplicates', function () {
            var returnValue1 = {};
            var numberOfTimesReturnsOverride1WasCalled = 0;
            var returnsOverride1 = function (_arg) {
                numberOfTimesReturnsOverride1WasCalled++;
                return returnValue1;
            };
            var error1 = {};
            var numberOfTimesThrowsOverride1WasCalled = 0;
            var throwsOverride1 = function (_arg) {
                numberOfTimesThrowsOverride1WasCalled++;
                return error1;
            };
            var numberOfTimesCallbackOverride1WasCalled = 0;
            var callbackOverride1 = function (_arg) {
                numberOfTimesCallbackOverride1WasCalled++;
            };
            var error2 = {};
            var numberOfTimesThrowsOverride2WasCalled = 0;
            var throwsOverride2 = function (_arg) {
                numberOfTimesThrowsOverride2WasCalled++;
                return error2;
            };
            var returnValue2 = {};
            var numberOfTimesReturnsOverride2WasCalled = 0;
            var returnsOverride2 = function (_arg) {
                numberOfTimesReturnsOverride2WasCalled++;
                return returnValue2;
            };
            var numberOfTimesCallbackOverride2WasCalled = 0;
            var callbackOverride2 = function (_arg) {
                numberOfTimesCallbackOverride2WasCalled++;
            };
            var throwsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(throwsOverride1);
            var throwsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(throwsOverride2);
            var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride1);
            var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(returnsOverride2);
            var callbackOverrideCallMode1 = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride1);
            var callbackOverrideCallMode2 = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(callbackOverride2);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode1;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = callbackOverrideCallMode2;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
            oneArgsFunctionProxy.callFunction([It_1.It.isAny(Number)]);
            setInvokeMode();
            var result = oneArgsFunctionProxy.callFunction([1]);
            chai_1.expect(numberOfTimesReturnsOverride1WasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesThrowsOverride1WasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesCallbackOverride1WasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesThrowsOverride2WasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesReturnsOverride2WasCalled).to.be.equal(1);
            chai_1.expect(numberOfTimesCallbackOverride2WasCalled).to.be.equal(1);
            chai_1.expect(result).to.be.equal(returnValue2);
        });
    });
    describe('callFunction - strict', function () {
        it('no setup should throw error', function () {
            functionProxyConfigurations.isStrict = true;
            var actualError;
            try {
                noArgsFunctionProxy.callFunction([]);
            }
            catch (error) {
                actualError = error;
            }
            chai_1.expect(actualError).to.not.be.undefined;
        });
        it('has callback setup should not thow error', function () {
            functionProxyConfigurations.isStrict = true;
            var functionCallMode = new CallbackOverrideFunctionCallMode_1.CallbackOverrideFunctionCallMode(function () { });
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            var actualError;
            try {
                noArgsFunctionProxy.callFunction([]);
            }
            catch (error) {
                actualError = error;
            }
            chai_1.expect(actualError).to.be.undefined;
        });
        it('has returns setup should not thow error', function () {
            functionProxyConfigurations.isStrict = true;
            var functionCallMode = new ReturnsOverrideFunctionCallMode_1.ReturnsOverrideFunctionCallMode(function () { return 1; });
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            var actualError;
            try {
                noArgsFunctionProxy.callFunction([]);
            }
            catch (error) {
                actualError = error;
            }
            chai_1.expect(actualError).to.be.undefined;
        });
        it('has throws setup should thow the configured error', function () {
            functionProxyConfigurations.isStrict = true;
            var thrownError = {};
            var functionCallMode = new ThrowsOverrideFunctionCallMode_1.ThrowsOverrideFunctionCallMode(function () { throw thrownError; });
            functionProxyConfigurations.functionCallMode = functionCallMode;
            noArgsFunctionProxy.callFunction([]);
            setInvokeMode();
            var actualError;
            try {
                noArgsFunctionProxy.callFunction([]);
            }
            catch (error) {
                actualError = error;
            }
            chai_1.expect(actualError).to.be.equal(thrownError);
        });
    });
});
