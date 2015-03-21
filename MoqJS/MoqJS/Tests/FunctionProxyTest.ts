'use strict';

module Tests {
    import ItIsBase = moqJS.ItIsBase;
    import FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;
    import FunctionProxy = moqJS.FunctionProxy;
    import VerifyFunctionCallMode = moqJS.VerifyFunctionCallMode;

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

    QUnit.test('callFunction - no arguments should call only the original function', function (assert: QUnitAssert) {
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

    QUnit.test('callFunction - one arguments should call only the original function', function (assert: QUnitAssert) {
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

    QUnit.test('callFunction - many arguments should call only the original function', function (assert: QUnitAssert) {
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

    QUnit.test('callFunction - returning1Function - should return the original function result', 1, function (assert: QUnitAssert) {
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
}
