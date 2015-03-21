'use strict';
var Tests;
(function (Tests) {
    var FunctionOverrideType = moqJS.FunctionOverrideType;
    var FunctionSetup = moqJS.FunctionSetup;
    var FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;

    var FunctionSetupLyfecycleObject = (function () {
        function FunctionSetupLyfecycleObject() {
            this.beforeEach = function () {
                var context = this;

                context.argument = {};
                context.testObject = new Tests.TestObject();
                context.functionProxyConfigurations = new FunctionProxyConfigurations();

                context.oneArgumentFunctionSetup = new FunctionSetup(function (object) {
                    return object.oneArgumentsFunction(context.argument);
                }, context.testObject, context.functionProxyConfigurations);

                context.returning1FunctionSetup = new FunctionSetup(function (object) {
                    return object.returning1Function();
                }, context.testObject, context.functionProxyConfigurations);
            };
            this.afterEach = function () {
            };
        }
        return FunctionSetupLyfecycleObject;
    })();

    QUnit.module('FunctionSetup', new FunctionSetupLyfecycleObject());

    QUnit.test('constructor - should initialize correctly', 3, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var functionCall = function (object) {
            return object.returning1Function();
        };
        var functionProxyConfigurations = new FunctionProxyConfigurations();

        // Act
        var functionSetup = new FunctionSetup(functionCall, testObject, functionProxyConfigurations);

        // Assert
        assert.strictEqual(functionSetup.object, testObject, 'testObject should be same');
        assert.strictEqual(functionSetup.functionCall, functionCall, 'functionCall should be same');
        assert.strictEqual(functionSetup.functionProxyConfigurations, functionProxyConfigurations, 'functionProxyConfigurations should be same');
    });

    QUnit.test('returns - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.returns(4);
    });

    QUnit.test('returns - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            var overrideType = context.functionProxyConfigurations.functionOverride.overrideType;

            assert.strictEqual(overrideType, 0 /* Returns */, 'override type should be returns');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            var result = context.functionProxyConfigurations.functionOverride.override();

            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value 2', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            var result = context.functionProxyConfigurations.functionOverride.override();

            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var newReturnValue = {};

        // Act
        context.oneArgumentFunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.returns(4);
    });

    QUnit.test('returns - after returns functionOverride should be null', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.returns(4);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.functionOverride, null, 'functionOverride should be null');
    });

    QUnit.test('lazyReturns - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(function () {
            return 4;
        });
    });

    QUnit.test('lazyReturns - should call when the override type is LazyReturns', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            var overrideType = context.functionProxyConfigurations.functionOverride.overrideType;

            assert.strictEqual(overrideType, 1 /* LazyReturns */, 'override type should be LazyReturns');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override contains function that returns the new value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            var result = context.functionProxyConfigurations.functionOverride.override();

            assert.strictEqual(result, returnValue, 'should return the setup value');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override contains function that returns the new value 2', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};
        var returnFunction = function () {
            return newReturnValue;
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            var result = context.functionProxyConfigurations.functionOverride.override();

            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var returnFrunction = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(returnFrunction);
    });

    QUnit.test('lazyReturns - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });
    });

    QUnit.test('lazyReturns - after returns functionOverride should be null', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.functionOverride, null, 'functionOverride should be null');
    });

    QUnit.test('callback - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        var callback = function () {
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override type is Callback', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var overrideType = context.functionProxyConfigurations.functionOverride.overrideType;

            // Assert
            assert.strictEqual(overrideType, 3 /* Callback */, 'override type should be Callback');
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override contains the callback', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
            // Assert
            assert.ok(true, 'callback was called');
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            context.functionProxyConfigurations.functionOverride.override();
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override contains the callback with same parameter', 2, function (assert) {
        // Arrange
        var context = this;

        var callback = function (_arg) {
            // Assert
            assert.ok(true, 'callback was called');
            assert.strictEqual(_arg, context.argument, 'should be the same parameter');
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            context.functionProxyConfigurations.functionOverride.override(_arg);
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var callback = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        var callback = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - after callback functionOverride should be null', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.callback(function () {
        });

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.functionOverride, null, 'functionOverride should be null');
    });

    QUnit.test('throws - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.throws(4);
    });

    QUnit.test('throws - should call when the override type is Throws', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var overrideType = context.functionProxyConfigurations.functionOverride.overrideType;

            // Assert
            assert.strictEqual(overrideType, 2 /* Throws */, 'override type should be Throws');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that throws the error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            try  {
                context.functionProxyConfigurations.functionOverride.override();
            } catch (_error) {
                assert.strictEqual(_error, error, 'should throw the error');
            }
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that throws the error 2', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            try  {
                context.functionProxyConfigurations.functionOverride.override();
            } catch (_error) {
                assert.strictEqual(_error, error, 'should throw the error');
            }
        };

        // Act
        context.oneArgumentFunctionSetup.throws(error);
    });

    QUnit.test('throws - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var error = {};

        // Act
        context.oneArgumentFunctionSetup.throws(error);
    });

    QUnit.test('throws - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.throws(4);
    });

    QUnit.test('throws - after callback functionOverride should be null', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.throws({});

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.functionOverride, null, 'functionOverride should be null');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=FunctionSetupTest.js.map
