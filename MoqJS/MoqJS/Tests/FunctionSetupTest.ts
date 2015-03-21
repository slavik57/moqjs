'use strict';

module Tests {
    import FunctionOverrideType = moqJS.FunctionOverrideType;
    import FunctionSetup = moqJS.FunctionSetup;
    import FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;
    import IFunctionCallMode = moqJS.IFunctionCallMode;
    import OverrideFunctionCallMode = moqJS.OverrideFunctionCallMode;
    import InvokeFunctionCallMode = moqJS.InvokeFunctionCallMode;

    class FunctionSetupLyfecycleObject implements LifecycleObject {
        public argument: any;
        public testObject: TestObject;
        public functionProxyConfigurations: FunctionProxyConfigurations;

        public oneArgumentFunctionSetup: FunctionSetup<TestObject>;
        public returning1FunctionSetup: FunctionSetup<TestObject>;

        public beforeEach = function () {
            var context: FunctionSetupLyfecycleObject = this;

            context.argument = {};
            context.testObject = new TestObject();
            context.functionProxyConfigurations = new FunctionProxyConfigurations();

            context.oneArgumentFunctionSetup = new FunctionSetup((object: TestObject) => object.oneArgumentsFunction(context.argument),
                context.testObject,
                context.functionProxyConfigurations);

            context.returning1FunctionSetup = new FunctionSetup((object: TestObject) => object.returning1Function(),
                context.testObject,
                context.functionProxyConfigurations);
        }

        public afterEach = function () {
        }
    }

    QUnit.module('FunctionSetup', new FunctionSetupLyfecycleObject());

    QUnit.test('constructor - should initialize correctly', 3, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();
        var functionCall = (object: TestObject) => object.returning1Function();
        var functionProxyConfigurations = new FunctionProxyConfigurations();

        // Act
        var functionSetup = new FunctionSetup(functionCall, testObject, functionProxyConfigurations);

        // Assert
        assert.strictEqual(functionSetup.object, testObject, 'testObject should be same');
        assert.strictEqual(functionSetup.functionCall, functionCall, 'functionCall should be same');
        assert.strictEqual(functionSetup.functionProxyConfigurations, functionProxyConfigurations, 'functionProxyConfigurations should be same');
    });

    QUnit.test('returns - should call functionCall', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(true, 'should be called');
        }

        // Act
        context.returning1FunctionSetup.returns(4);
    });

    QUnit.test('returns - should call when the ', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            var functionCallMode: IFunctionCallMode = context.functionProxyConfigurations.functionCallMode

            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'should be of OverrideFunctionCallMode type');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override type is returns', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = () => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var overrideType: FunctionOverrideType = overrideMode.overrideType;

            // Assert
            assert.strictEqual(overrideType, FunctionOverrideType.Returns, 'override type should be returns');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = () => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;

            var result = overrideMode.override();

            // Assert
            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var newReturnValue = {};

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var result = overrideMode.override();

            // Assert
            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should not call other function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var newReturnValue = {};

        // Act
        context.oneArgumentFunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call functionCall with same parameter', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        }

        // Act
        context.oneArgumentFunctionSetup.returns(4);
    });

    QUnit.test('returns - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        // Act
        context.oneArgumentFunctionSetup.returns(4);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyReturns - should call functionCall', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(true, 'should be called');
        }

        // Act
        context.returning1FunctionSetup.lazyReturns(() => 4);
    });

    QUnit.test('lazyReturns - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var returnValue = {};

        var returnFunction = () => {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = () => {
            var functionCallMode: IFunctionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override type is LazyReturns', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var returnValue = {};

        var returnFunction = () => {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = () => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var overrideType: FunctionOverrideType = overrideMode.overrideType;

            // Assert
            assert.strictEqual(overrideType, FunctionOverrideType.LazyReturns, 'override type should be LazyReturns');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override contains function that returns the new value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var returnValue = {};

        var returnFunction = () => {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = () => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var result = overrideMode.override();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the setup value');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override contains function that returns the new value 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var newReturnValue = {};
        var returnFunction = () => {
            return newReturnValue;
        }

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var result = overrideMode.override();

            // Assert
            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should not call other function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var returnFrunction = () => { };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(returnFrunction);
    });

    QUnit.test('lazyReturns - should call functionCall with same parameter', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        }

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(() => 4);
    });

    QUnit.test('lazyReturns - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(() => 4);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('callback - should call functionCall', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(true, 'should be called');
        }

        var callback = () => { };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the functionCallMode type is OverrideFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var callback = () => { };

        context.testObject.onReturnung1FunctionCalled = () => {
            var functionCallMode: IFunctionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override type is Callback', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var callback = () => { };

        context.testObject.onReturnung1FunctionCalled = () => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var overrideType: FunctionOverrideType = overrideMode.overrideType;

            // Assert
            assert.strictEqual(overrideType, FunctionOverrideType.Callback, 'override type should be Callback');
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override contains the callback', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var callback = () => {
            // Assert
            assert.ok(true, 'callback was called');
        };

        context.testObject.onReturnung1FunctionCalled = () => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            overrideMode.override();
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override contains the callback with same parameter', 2, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var callback = (_arg) => {
            // Assert
            assert.ok(true, 'callback was called');
            assert.strictEqual(_arg, context.argument, 'should be the same parameter');
        };

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            var overrideMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            overrideMode.override(_arg);
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should not call other function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var callback = () => { };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call functionCall with same parameter', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        }

        var callback = () => { };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - after callback functionCallMode should be InvokeFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        // Act
        context.oneArgumentFunctionSetup.callback(() => { });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('throws - should call functionCall', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(true, 'should be called');
        }

        // Act
        context.returning1FunctionSetup.throws(4);
    });

    QUnit.test('throws - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = () => {
            var functionCallMode: IFunctionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override type is Throws', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = () => {
            var functionCallMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
            var overrideType: FunctionOverrideType = functionCallMode.overrideType;

            // Assert
            assert.strictEqual(overrideType, FunctionOverrideType.Throws, 'override type should be Throws');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that throws the error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            try {
                var functionCallMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
                functionCallMode.override();
            } catch (_error) {
                assert.strictEqual(_error, error, 'should throw the error');
            }
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that throws the error 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        var error = {};

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            try {
                var functionCallMode = <OverrideFunctionCallMode>context.functionProxyConfigurations.functionCallMode;
                functionCallMode.override();
            } catch (_error) {
                assert.strictEqual(_error, error, 'should throw the error');
            }
        };

        // Act
        context.oneArgumentFunctionSetup.throws(error);
    });

    QUnit.test('throws - should not call other function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onReturnung1FunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var error = {};

        // Act
        context.oneArgumentFunctionSetup.throws(error);
    });

    QUnit.test('throws - should call functionCall with same parameter', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        }

        // Act
        context.oneArgumentFunctionSetup.throws(4);
    });

    QUnit.test('throws - after callback functionCallMode should be InvokeFunctionCallMode', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: FunctionSetupLyfecycleObject = this;

        // Act
        context.oneArgumentFunctionSetup.throws({});

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });
}