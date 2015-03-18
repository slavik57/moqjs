'use strict';

module Tests {
    import FunctionProxyConfigurations = mockJS.FunctionProxyConfigurations;
    import FunctionProxy = mockJS.FunctionProxy;

    class TestObject {
        public onNoArgumentsFunctionCalled: () => void;
        public onOneArgumentsFunctionCalled: (arg1: any) => void;
        public onManyArgumentsFunctionCalled: (arg1: any, arg2: any, arg3: any) => void;

        public noArgumentsFunction() {
            if (this.onNoArgumentsFunctionCalled) {
                this.onNoArgumentsFunctionCalled();
            }
        }

        public oneArgumentsFunction(arg1: any) {
            if (this.onOneArgumentsFunctionCalled) {
                this.onOneArgumentsFunctionCalled(arg1);
            }
        }

        public manyArgumentsFunction(arg1: any, arg2: any, arg3: any) {
            if (this.onManyArgumentsFunctionCalled) {
                this.onManyArgumentsFunctionCalled(arg1, arg2, arg3);
            }
        }
    }

    class FunctionProxyLifecycleObject implements LifecycleObject {

        public thisObject: TestObject;
        public functionProxyConfigurations: FunctionProxyConfigurations;

        public noArgsFunctionProxy: FunctionProxy;
        public oneArgsFunctionProxy: FunctionProxy;
        public manyArgsFunctionProxy: FunctionProxy;

        public beforeEach = function () {
            var context: FunctionProxyLifecycleObject = this;

            context.thisObject = new TestObject();
            context.functionProxyConfigurations = new FunctionProxyConfigurations();

            // Act
            context.noArgsFunctionProxy = new FunctionProxy(context.thisObject.noArgumentsFunction,
                context.thisObject,
                context.functionProxyConfigurations);

            context.oneArgsFunctionProxy = new FunctionProxy(context.thisObject.oneArgumentsFunction,
                context.thisObject,
                context.functionProxyConfigurations);

            context.manyArgsFunctionProxy = new FunctionProxy(context.thisObject.manyArgumentsFunction,
                context.thisObject,
                context.functionProxyConfigurations);
        };
        public afterEach = function () {
        };
    }

    QUnit.module('FunctionProxy', new FunctionProxyLifecycleObject());

    QUnit.test('constructor - should initialize correctly', function (assert: QUnitAssert) {
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

    QUnit.test('callFunction - verify mode no arguments -  was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, false, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called twice should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([]);
        context.noArgsFunctionProxy.callFunction([]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([{}]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, false, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments and without arguments should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        context.noArgsFunctionProxy.callFunction([{}]);
        context.noArgsFunctionProxy.callFunction([]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with same arguments should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg = {};
        context.noArgsFunctionProxy.callFunction([arg]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, true, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with different arguments should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: FunctionProxyLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        context.noArgsFunctionProxy.callFunction([arg1]);

        context.functionProxyConfigurations.isVerifying = true;

        // Act
        context.noArgsFunctionProxy.callFunction([arg2]);

        // Assert
        assert.strictEqual(context.functionProxyConfigurations.hasMatch, false, 'should not find a match');
    });

    // TODO: test one and many arguments in verify mode
}
