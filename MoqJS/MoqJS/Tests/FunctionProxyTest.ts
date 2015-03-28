'use strict';

module Tests {
    import ItIsBase = moqJS.ItIsBase;
    import It = moqJS.It;
    import FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;
    import FunctionProxy = moqJS.FunctionProxy;
    import VerifyFunctionCallMode = moqJS.VerifyFunctionCallMode;
    import IFunctionCallMode = moqJS.IFunctionCallMode;
    import OverrideFunctionCallMode = moqJS.OverrideFunctionCallMode;
    import CallbackOverrideFunctionCallMode = moqJS.CallbackOverrideFunctionCallMode;
    import ReturnsOverrideFunctionCallMode = moqJS.ReturnsOverrideFunctionCallMode;
    import ThrowsOverrideFunctionCallMode = moqJS.ThrowsOverrideFunctionCallMode;
    import InvokeFunctionCallMode = moqJS.InvokeFunctionCallMode;

    class FunctionProxyLifecycleObject implements LifecycleObject {

        public thisObject: TestObject;
        public functionProxyConfigurations: FunctionProxyConfigurations;

        public noArgsFunctionProxy: FunctionProxy;
        public oneArgsFunctionProxy: FunctionProxy;
        public manyArgsFunctionProxy: FunctionProxy;
        public returning1FunctionProxy: FunctionProxy;

        public beforeEach = function () {
            var context: FunctionProxyLifecycleObject = this;

            context.thisObject = new TestObject();
            context.functionProxyConfigurations = new FunctionProxyConfigurations();

            context.noArgsFunctionProxy = new FunctionProxy(context.thisObject.noArgumentsFunction,
                context.thisObject,
                context.functionProxyConfigurations);

            context.oneArgsFunctionProxy = new FunctionProxy(context.thisObject.oneArgumentsFunction,
                context.thisObject,
                context.functionProxyConfigurations);

            context.manyArgsFunctionProxy = new FunctionProxy(context.thisObject.manyArgumentsFunction,
                context.thisObject,
                context.functionProxyConfigurations);

            context.returning1FunctionProxy = new FunctionProxy(context.thisObject.returning1Function,
                context.thisObject,
                context.functionProxyConfigurations);
        };

        public afterEach = function () {
        };

        public setVerifyMode = function () {
            var context: FunctionProxyLifecycleObject = this;

            var verifyFunctionCallMode = new VerifyFunctionCallMode();

            context.functionProxyConfigurations.functionCallMode = verifyFunctionCallMode;

            return verifyFunctionCallMode;
        }

        public setInvokeMode = function () {
            var context: FunctionProxyLifecycleObject = this;

            var invokeFunctionCallMode = new InvokeFunctionCallMode();

            context.functionProxyConfigurations.functionCallMode = invokeFunctionCallMode;
        }

    }

    QUnit.module('FunctionProxy', new FunctionProxyLifecycleObject());

    QUnit.test('constructor - should initialize correctly', function (assert: QUnitAssert) {
        QUnit.expect(3);

        // Arrange
        var originalFunction = new Function();
        var thisObject = {};
        var functionProxyConfigurations = new FunctionProxyConfigurations();

        // Act
        var proxy = new FunctionProxy(originalFunction, thisObject, functionProxyConfigurations);

        // Assert
        assert.strictEqual(proxy.thisObject, thisObject);
        assert.strictEqual(proxy.originalFunction, originalFunction);
        assert.strictEqual(proxy.functionProxyConfigurations, functionProxyConfigurations);
    });

    QUnit.test('callbase - set to true, should call the original function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.functionProxyConfigurations.callBase = true;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(true, 'should call original function');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callbase - set to false, should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.functionProxyConfigurations.callBase = false;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should call original function');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callbase - set to false, should not return the original function result', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.functionProxyConfigurations.callBase = false;

        // Act
        var result = context.returning1FunctionProxy.callFunction([]);

        // Assert
        assert.notStrictEqual(result, 1, 'should not return the original value');
    });

    QUnit.test('callbase - set to false, should not return undefined', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.functionProxyConfigurations.callBase = false;

        // Act
        var result = context.returning1FunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('callFunction - unknown mode - should throw error', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var unknownFunctionCallMode: IFunctionCallMode = {};

        context.functionProxyConfigurations.functionCallMode = unknownFunctionCallMode;

        try {
            // Act
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            assert.ok(true, 'should throw error on unknown functionCallMode');
        }
    });

    QUnit.test('callFunction - invoke mode - no arguments should call only the original function', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = () => {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.thisObject.onManyArgumentsFunctionCalled = () => {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - invoke mode - one arguments should call only the original function', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        context.thisObject.onManyArgumentsFunctionCalled = () => {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.oneArgsFunctionProxy.callFunction([arg]);
    });

    QUnit.test('callFunction - invoke mode - many arguments should call only the original function', function (assert: QUnitAssert) {
        QUnit.expect(3);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = () => {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - invoke mode - returning1Function - should return the original function result', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        // Act
        var result = context.returning1FunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(result, 1, 'should return the original value');
    });

    QUnit.test('callFunction - verify mode no arguments -  was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called twice should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([]);
        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 2, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([{}]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments and without arguments should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([{}]);
        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with same arguments should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};
        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with different arguments should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        context.noArgsFunctionProxy.callFunction([arg1]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg2]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument -  was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var arg = {};

        // Act
        context.oneArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called with IItIs which returns false, should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = () => {
            return false;
        };

        // Act
        context.noArgsFunctionProxy.callFunction([itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called with IItIs which returns true, should f-nd a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = () => {
            return true;
        };

        // Act
        context.noArgsFunctionProxy.callFunction([itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 2, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should find a match for first arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.noArgsFunctionProxy.callFunction([arg1]);
        context.noArgsFunctionProxy.callFunction([arg2]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg1]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should find a match for second arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.noArgsFunctionProxy.callFunction([arg1]);
        context.noArgsFunctionProxy.callFunction([arg2]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg2]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should not find a match for another arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.noArgsFunctionProxy.callFunction([arg1]);
        context.noArgsFunctionProxy.callFunction([arg2]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called without arguments should not find a match with arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called without arguments should find a match without arguments', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called with IItIs which returns true 3 times, should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var numberOfTimesReturnedTrue = 0;
        var itIs = new ItIsBase();
        itIs.match = () => {
            numberOfTimesReturnedTrue++;
            return numberOfTimesReturnedTrue <= 3;
        };

        // Act
        context.noArgsFunctionProxy.callFunction([itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 3, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 2, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice with different sets should find a match for first set', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet1);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice with different sets should find a match for second set', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet2);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice with different sets should not find a match for different set', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];
        var argSet3 = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet3);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments - was called twice with different sets should not find a match for set with one different parameter', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];
        var argSet3 = [argSet1[0], argSet1[1], argSet2[2]];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet3);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with less parameters should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with more parameters should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with more parameters should not find a match with less parameters', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], argSet[2]]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with ItIs that returns false should not find a match with less parameters', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = () => {
            return false;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with ItIs that returns true should find a match with less parameters', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var itIs = new ItIsBase()
        itIs.match = () => {
            return true;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with ItIs that returns true 3 times should find a match with less parameters', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var numberOfTimesReturnedTrue = 0;
        var itIs = new ItIsBase()
        itIs.match = () => {
            numberOfTimesReturnedTrue++;
            return numberOfTimesReturnedTrue <= 3;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 3, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with 3 ItIs that returns true should find a match with less parameters', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var itIs = new ItIsBase()
        itIs.match = () => {
            return true;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([itIs, itIs, itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with 2 ItIs that returns true and one that returns false should find a match with less parameters', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode: VerifyFunctionCallMode = context.setVerifyMode();

        var trueItIs = new ItIsBase()
        trueItIs.match = () => {
            return true;
        };

        var falseItIs = new ItIsBase()
        falseItIs.match = () => {
            return false;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([trueItIs, falseItIs, trueItIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - override mode Callback - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Callback - should not call the original function with arguments', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.manyArgsFunctionProxy.callFunction([{}, {}, {}]);
    });

    QUnit.test('callFunction - override mode Returns - should not call the original function with arguments', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.manyArgsFunctionProxy.callFunction([{}, {}, {}]);
    });

    QUnit.test('callFunction - override mode Throws - should not call the original function with arguments', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.manyArgsFunctionProxy.callFunction([{}, {}, {}]);
    });

    QUnit.test('callFunction - override mode Callback - invoking the function should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = () => { };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        try {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (e) {
        }
    });

    QUnit.test('callFunction - override mode Callback - invoking the function should call the override function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var override = () => {
            // Assert
            assert.ok(true, 'should call the overriden function');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function should call the override function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var override = () => {
            // Assert
            assert.ok(true, 'should call the overriden function');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function should call the override function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var override = () => {
            // Assert
            assert.ok(true, 'should call the overriden function');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        try {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - calling the function should not call the override function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var override = () => {
            // Assert
            assert.ok(false, 'should not call the overriden function on override mode');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - calling the function should not call the override function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var override = () => {
            // Assert
            assert.ok(false, 'should not call the overriden function on override mode');
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - calling the function should not call the override function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var override = () => {
            // Assert
            assert.ok(false, 'should not call the overriden function on override mode');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Callback - invoking the function should call the override with same parameters', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args = [{}, {}, {}];

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, args[0], 'should pass the parameters');
            assert.strictEqual(_arg2, args[1], 'should pass the parameters');
            assert.strictEqual(_arg3, args[2], 'should pass the parameters');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function should call the override with same parameters', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args = [{}, {}, {}];

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, args[0], 'should pass the parameters');
            assert.strictEqual(_arg2, args[1], 'should pass the parameters');
            assert.strictEqual(_arg3, args[2], 'should pass the parameters');
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function should call the override with same parameters', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args = [{}, {}, {}];

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, args[0], 'should pass the parameters');
            assert.strictEqual(_arg2, args[1], 'should pass the parameters');
            assert.strictEqual(_arg3, args[2], 'should pass the parameters');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        try {
            context.manyArgsFunctionProxy.callFunction(args);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - invoking the function with other parameters should not call the override', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args = [{}, {}, {}];

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.ok(false, 'should not call override');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function with other parameters should not call the override', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args = [{}, {}, {}];

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.ok(false, 'should not call override');
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function with other parameters should not call the override', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args = [{}, {}, {}];

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.ok(false, 'should not call override');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        try {
            context.manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - invoking the function with other parameters should call the original function', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args1 = [{}, {}, {}];
        var args2 = [args1[0], args1[1], {}];

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, args2[0], 'should call with the parameters');
            assert.strictEqual(_arg2, args2[1], 'should call with the parameters');
            assert.strictEqual(_arg3, args2[2], 'should call with the parameters');
        };

        var override = () => { };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args1);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args2);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function with other parameters should call the original function', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args1 = [{}, {}, {}];
        var args2 = [args1[0], args1[1], {}];

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            assert.strictEqual(_arg1, args2[0], 'should call with the parameters');
            assert.strictEqual(_arg2, args2[1], 'should call with the parameters');
            assert.strictEqual(_arg3, args2[2], 'should call with the parameters');
        };

        var override = () => { };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args1);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args2);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function with other parameters should call the original function', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var args1 = [{}, {}, {}];
        var args2 = [args1[0], args1[1], {}];

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            assert.strictEqual(_arg1, args2[0], 'should call with the parameters');
            assert.strictEqual(_arg2, args2[1], 'should call with the parameters');
            assert.strictEqual(_arg3, args2[2], 'should call with the parameters');
        };

        var override = () => { };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args1);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args2);
    });

    QUnit.test('callFunction - override mode Callback - calling the function with ItIs and than invoking should call the override', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            assert.ok(false, 'should not call the original');
        };

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Return - calling the function with ItIs and than invoking should call the override', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            assert.ok(false, 'should not call the original');
        };

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Throws - calling the function with ItIs and than invoking should call the override', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            assert.ok(false, 'should not call the original');
        };

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var override = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        try {
            context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var arg1 = 1;
        var arg2 = '';
        var arg3 = 3;

        var override = (_arg1, _arg2, _arg3) => {
            assert.ok(false, 'should not call the override');
        };

        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Returns - calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var arg1 = 1;
        var arg2 = '';
        var arg3 = 3;

        var override = (_arg1, _arg2, _arg3) => {
            assert.ok(false, 'should not call the override');
        };

        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Throws - calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.thisObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var arg1 = 1;
        var arg2 = '';
        var arg3 = 3;

        var override = (_arg1, _arg2, _arg3) => {
            assert.ok(false, 'should not call the override');
        };

        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should call all on invoke', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var error = {};
        var throwsOverride = (_arg) => {
            assert.ok(true, 'throws override should be called');
            return error;
        }

        var returnValue = {};
        var returnsOverride = (_arg) => {
            assert.ok(true, 'returns override should be called');
            return returnValue;
        }

        var callbackOverride = (_arg) => {
            assert.ok(true, 'callback override should be called');
        }

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should call all on invoke with same parameter', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};

        var error = {};
        var throwsOverride = (_arg) => {
            assert.strictEqual(_arg, arg, 'arguments should match');
            return error;
        }

        var returnValue = {};
        var returnsOverride = (_arg) => {
            assert.strictEqual(_arg, arg, 'arguments should match');
            return returnValue;
        }

        var callbackOverride = (_arg) => {
            assert.strictEqual(_arg, arg, 'arguments should match');
        }

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([arg]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([arg]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([arg]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([arg]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call all on invoke', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var error = {};
        var throwsOverride = (_arg) => {
            assert.ok(true, 'throws override should be called');
            return error;
        }

        var returnValue = {};
        var returnsOverride = (_arg) => {
            assert.ok(true, 'returns override should be called');
            return returnValue;
        }

        var callbackOverride = (_arg) => {
            assert.ok(true, 'callback override should be called');
        }

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call only a callback on invoke', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var error = {};
        var throwsOverride = (_arg) => {
            assert.ok(false, 'throws override should not be called');
            return error;
        }

        var returnValue = {};
        var returnsOverride = (_arg) => {
            assert.ok(false, 'returns override should not be called');
            return returnValue;
        }

        var callbackOverride = (_arg) => {
            assert.ok(true, 'callback override should be called');
        }

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call only a returns on invoke', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var error = {};
        var throwsOverride = (_arg) => {
            assert.ok(false, 'throws override should not be called');
            return error;
        }

        var returnValue = {};
        var returnsOverride = (_arg) => {
            assert.ok(true, 'returns override should be called');
            return returnValue;
        }

        var callbackOverride = (_arg) => {
            assert.ok(false, 'callback override should not be called');
        }

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call only a throws on invoke', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var error = {};
        var throwsOverride = (_arg) => {
            assert.ok(true, 'throws override should be called');
            return error;
        }

        var returnValue = {};
        var returnsOverride = (_arg) => {
            assert.ok(false, 'returns override should not be called');
            return returnValue;
        }

        var callbackOverride = (_arg) => {
            assert.ok(false, 'callback override should not be called');
        }

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        // Act
        context.setInvokeMode();
        try {
            context.oneArgsFunctionProxy.callFunction([1]);
        } catch (e) {
        }
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should return the return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

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

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        var result = context.oneArgsFunctionProxy.callFunction([1]);

        // Assert
        assert.strictEqual(result, returnValue, 'should throw the error');
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should throw the error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

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

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        try {
            context.oneArgsFunctionProxy.callFunction([1]);
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error, 'should return the return value');
        }
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should throw the last error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

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

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        try {
            context.oneArgsFunctionProxy.callFunction([1]);
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error2, 'should throw the second error');
        }
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should return the last return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

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

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        var result = context.oneArgsFunctionProxy.callFunction([1]);

        // Assert
        assert.strictEqual(result, returnValue2, 'should return the second return value');
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should call all duplicates', 7, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var returnValue1 = {};
        var returnsOverride1 = (_arg) => {
            assert.ok(true, '1st return should be called');
            return returnValue1;
        }

        var error1 = {};
        var throwsOverride1 = (_arg) => {
            assert.ok(true, '1st throws should be called');
            return error1;
        }

        var callbackOverride1 = (_arg) => {
            assert.ok(true, '1st callbeck should be called');
        }

        var error2 = {};
        var throwsOverride2 = (_arg) => {
            assert.ok(true, '2nd throws should be called');
            return error2;
        }

        var returnValue2 = {};
        var returnsOverride2 = (_arg) => {
            assert.ok(true, '2nd return should be called');
            return returnValue2;
        }

        var callbackOverride2 = (_arg) => {
            assert.ok(true, '2nd callbeck should be called');
        }

        var throwsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
        var throwsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
        var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
        var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
        var callbackOverrideCallMode1 = new CallbackOverrideFunctionCallMode(callbackOverride1);
        var callbackOverrideCallMode2 = new CallbackOverrideFunctionCallMode(callbackOverride2);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        var result = context.oneArgsFunctionProxy.callFunction([1]);

        // Assert
        assert.strictEqual(result, returnValue2, 'should return the second return value');
    });

    QUnit.test('callFunction - strict - no setup should throw error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;
        context.functionProxyConfigurations.isStrict = true;

        // Act
        try {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('callFunction - strict - has callback setup should not thow error', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;
        context.functionProxyConfigurations.isStrict = true;

        var functionCallMode = new CallbackOverrideFunctionCallMode(() => { });
        context.functionProxyConfigurations.functionCallMode = functionCallMode;
        context.noArgsFunctionProxy.callFunction([]);

        // Act
        try {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('callFunction - strict - has returns setup should not thow error', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;
        context.functionProxyConfigurations.isStrict = true;

        var functionCallMode = new ReturnsOverrideFunctionCallMode(() => 1);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;
        context.noArgsFunctionProxy.callFunction([]);

        // Act
        try {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('callFunction - strict - has throws setup should thow the configured error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionProxyLifecycleObject = this;
        context.functionProxyConfigurations.isStrict = true;

        var thrownError = {};
        var functionCallMode = new ThrowsOverrideFunctionCallMode(() => { throw thrownError; });
        context.functionProxyConfigurations.functionCallMode = functionCallMode;
        context.noArgsFunctionProxy.callFunction([]);

        context.setInvokeMode();

        // Act
        try {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.strictEqual(thrownError, error, 'should throw the configured error');
        }
    });
}
