'use strict';
var Tests;
(function (Tests) {
    var FunctionProxyConfigurations = mockJS.FunctionProxyConfigurations;
    var FunctionProxy = mockJS.FunctionProxy;

    var TestObject = (function () {
        function TestObject() {
        }
        TestObject.prototype.noArgumentsFunction = function () {
            if (this.onNoArgumentsFunctionCalled) {
                this.onNoArgumentsFunctionCalled();
            }
        };

        TestObject.prototype.oneArgumentsFunction = function (arg1) {
            if (this.onOneArgumentsFunctionCalled) {
                this.onOneArgumentsFunctionCalled(arg1);
            }
        };

        TestObject.prototype.manyArgumentsFunction = function (arg1, arg2, arg3) {
            if (this.onManyArgumentsFunctionCalled) {
                this.onManyArgumentsFunctionCalled(arg1, arg2, arg3);
            }
        };
        return TestObject;
    })();

    var FunctionProxyLifecycleObject = (function () {
        function FunctionProxyLifecycleObject() {
            this.beforeEach = function () {
                var context = this;

                context.thisObject = new TestObject();
                context.functionProxyConfigurations = new FunctionProxyConfigurations();

                // Act
                context.noArgsFunctionProxy = new FunctionProxy(context.thisObject.noArgumentsFunction, context.thisObject, context.functionProxyConfigurations);

                context.oneArgsFunctionProxy = new FunctionProxy(context.thisObject.oneArgumentsFunction, context.thisObject, context.functionProxyConfigurations);

                context.manyArgsFunctionProxy = new FunctionProxy(context.thisObject.manyArgumentsFunction, context.thisObject, context.functionProxyConfigurations);
            };
            this.afterEach = function () {
            };
        }
        return FunctionProxyLifecycleObject;
    })();

    QUnit.module('FunctionProxy', new FunctionProxyLifecycleObject());

    QUnit.test('constructor - should initialize correctly', function (assert) {
        QUnit.expect(3);

        // Arrange
        var functionToWrap = new Function();
        var thisObject = {};
        var functionProxyConfigurations = new FunctionProxyConfigurations();

        // Act
        var proxy = new FunctionProxy(functionToWrap, thisObject, functionProxyConfigurations);

        // Assert
        assert.strictEqual(proxy.thisObject, thisObject);
        assert.strictEqual(proxy.functionToWrap, functionToWrap);
        assert.strictEqual(proxy.functionProxyConfigurations, functionProxyConfigurations);
    });

    QUnit.test('callFunction - no arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = function () {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.thisObject.onManyArgumentsFunctionCalled = function () {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - one arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        context.thisObject.onManyArgumentsFunctionCalled = function () {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.oneArgsFunctionProxy.callFunction([arg]);
    });

    QUnit.test('callFunction - many arguments should call only the original function', function (assert) {
        QUnit.expect(3);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = function () {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - verify mode no arguments -  was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, false, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([]);
        context.noArgsFunctionProxy.callFunction([]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([{}]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, false, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments and without arguments should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([{}]);
        context.noArgsFunctionProxy.callFunction([]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with same arguments should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};
        context.noArgsFunctionProxy.callFunction([arg]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with different arguments should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        context.noArgsFunctionProxy.callFunction([arg1]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([arg2]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, false, 'should not find a match');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=FunctionProxyTest.js.map
