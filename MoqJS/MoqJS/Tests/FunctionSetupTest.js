'use strict';
var Tests;
(function (Tests) {
    var FunctionSetup = moqJS.FunctionSetup;
    var FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;

    var OverrideFunctionCallMode = moqJS.OverrideFunctionCallMode;
    var InvokeFunctionCallMode = moqJS.InvokeFunctionCallMode;
    var CallbackOverrideFunctionCallMode = moqJS.CallbackOverrideFunctionCallMode;
    var ReturnsOverrideFunctionCallMode = moqJS.ReturnsOverrideFunctionCallMode;
    var ThrowsOverrideFunctionCallMode = moqJS.ThrowsOverrideFunctionCallMode;

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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            var result = functionCallMode.override();

            // Assert
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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result = functionCallMode.override();

            // Assert
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

    QUnit.test('returns - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.returns(4);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('returns - should return the same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.returns(4);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should return the same setup');
    });

    QUnit.test('returnsInOrder - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.returnsInOrder([4, 5]);
    });

    QUnit.test('returnsInOrder - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
    });

    QUnit.test('returnsInOrder - should call when the override contains function that returns the new values', 4, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, newReturnValue1, 'should return the setup value1');
            assert.strictEqual(result2, newReturnValue2, 'should return the setup value2');
            assert.strictEqual(result3, newReturnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return undefined');
        };

        // Act
        context.returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
    });

    QUnit.test('returnsInOrder - should call when the override contains function that returns the new values 2', 4, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, newReturnValue1, 'should return the setup value1');
            assert.strictEqual(result2, newReturnValue2, 'should return the setup value2');
            assert.strictEqual(result3, newReturnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return undefined');
        };

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
    });

    QUnit.test('returnsInOrder - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var newReturnValue = {};

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([newReturnValue]);
    });

    QUnit.test('returnsInOrder - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([4]);
    });

    QUnit.test('returnsInOrder - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([4]);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('returnsInOrder - should return the same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.returnsInOrder([4]);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should return the same setup');
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

    QUnit.test('lazyReturns - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result = functionCallMode.override();

            // Assert
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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result = functionCallMode.override();

            // Assert
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

    QUnit.test('lazyReturns - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyReturns - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('lazyReturnsInOrder - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }, function () {
                return 5;
            }]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the override contains function that returns the new values', 4, function (assert) {
        // Arrange
        var context = this;

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

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, returnValue1, 'should return the setup value1');
            assert.strictEqual(result2, returnValue2, 'should return the setup value2');
            assert.strictEqual(result3, returnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return undefined');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the override contains function that returns the new values 2', 4, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        var returnFunction1 = function () {
            return newReturnValue1;
        };
        var returnFunction2 = function () {
            return newReturnValue2;
        };
        var returnFunction3 = function () {
            return newReturnValue3;
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, newReturnValue1, 'should return the setup value1');
            assert.strictEqual(result2, newReturnValue2, 'should return the setup value2');
            assert.strictEqual(result3, newReturnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);
    });

    QUnit.test('lazyReturnsInOrder - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var returnFrunction = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([returnFrunction]);
    });

    QUnit.test('lazyReturnsInOrder - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }]);
    });

    QUnit.test('lazyReturnsInOrder - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }]);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyReturnsInOrder - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }]);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
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

    QUnit.test('callback - should call when the functionCallMode type is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be OverrideFunctionCallMode');
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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof CallbackOverrideFunctionCallMode, 'functionCallMode should be callback');
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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            functionCallMode.override();
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
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            functionCallMode.override(_arg);
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

    QUnit.test('callback - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
        };

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.callback(callback);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('callback - after callback functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.callback(function () {
        });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
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

    QUnit.test('throws - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override type is Throws', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ThrowsOverrideFunctionCallMode, 'functionCallMode should be throws');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that returns the error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();

            // Assert
            assert.strictEqual(actualError, error, 'should throw the error');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that throws the error 2', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();
            assert.strictEqual(actualError, error, 'should throw the error');
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

    QUnit.test('throws - after callback functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.throws({});

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('throws - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.throws({});

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('lazyThrows - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(function () {
            return 'error';
        });
    });

    QUnit.test('lazyThrows - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call when the override type is throws', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ThrowsOverrideFunctionCallMode, 'functionCallMode should be throws');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call when the override contains function that returns the error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();

            // Assert
            assert.strictEqual(actualError, error, 'should throw the setup error');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call when the override contains function that throws the error 2', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();

            // Assert
            assert.strictEqual(actualError, error, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var errorReturningFunction = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(function () {
            return 4;
        });
    });

    QUnit.test('lazyThrows - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(function () {
            return 4;
        });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyThrows - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.lazyThrows(function () {
            return 4;
        });

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=FunctionSetupTest.js.map
