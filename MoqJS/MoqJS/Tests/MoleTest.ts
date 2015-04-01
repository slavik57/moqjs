'use strict';

module Tests {
    import ItIsBase = moqJS.ItIsBase;
    import It = moqJS.It;
    import ITimes = moqJS.ITimes;
    import Times = moqJS.Times;
    import Mole = moqJS.Mole;

    class MoleLifecycleObject implements LifecycleObject {
        public testObject: TestObject;
        public mole: Mole<TestObject>;

        public beforeEach = function () {
            var context: MoleLifecycleObject = this;

            context.testObject = new TestObject();

            context.mole = new Mole(context.testObject);
        };

        public afterEach = function () {
            var context: MoleLifecycleObject = this;

            context.mole.dispose();
        };
    }

    QUnit.module('Mole', new MoleLifecycleObject());

    QUnit.test('constructor - should initialize correctly', 1, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();

        // Act
        var mole = new Mole(testObject);

        // Assert
        assert.strictEqual(mole.object, testObject);
    });

    QUnit.test('noArgumentsFunction - should call only the original function', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = () => {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.testObject.onManyArgumentsFunctionCalled = () => {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('oneArgumentsFunction - one arguments should call only the original function', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.onNoArgumentsFunctionCalled = () => {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = (_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        context.testObject.onManyArgumentsFunctionCalled = () => {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('manyArgumentsFunction - many arguments should call only the original function', function (assert: QUnitAssert) {
        QUnit.expect(3);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.onNoArgumentsFunctionCalled = () => {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = () => {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.testObject.onManyArgumentsFunctionCalled = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('verify - should verify only the no arguments function', 3, function (assert: QUnitAssert) {

        // Arrange
        var context: MoleLifecycleObject = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.noArgumentsFunction();

        // Assert
        var verifyNoArguments = context.mole.verify(_ => _.noArgumentsFunction());
        var verifyOneArguments = context.mole.verify(_ => _.oneArgumentsFunction(arg1));
        var verifyManyArguments = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        assert.strictEqual(verifyNoArguments, true, 'no arguments should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verify - should verify only the one argument function', 3, function (assert: QUnitAssert) {

        // Arrange
        var context: MoleLifecycleObject = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.oneArgumentsFunction(arg1);

        // Assert
        var verifyNoArguments = context.mole.verify(_ => _.noArgumentsFunction());
        var verifyOneArguments = context.mole.verify(_ => _.oneArgumentsFunction(arg1));
        var verifyManyArguments = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, true, 'one arguments should be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verify - should verify only the many argument function', 3, function (assert: QUnitAssert) {

        // Arrange
        var context: MoleLifecycleObject = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        var verifyNoArguments = context.mole.verify(_ => _.noArgumentsFunction());
        var verifyOneArguments = context.mole.verify(_ => _.oneArgumentsFunction(arg1));
        var verifyManyArguments = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
    });

    QUnit.test('verify - no arguments - was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction());

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was not called should not find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was not called should return true on 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - no arguments - was called should return false on 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - no arguments - was called should return true on 1 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - no arguments - was called should return false on 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return true on 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return false on 1 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return false on 3 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - one argument - was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should not find 1 match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should not find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should find 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - one argument - was called should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - one argument - was called should find 1 match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - one argument - was called should not find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - one argument - was called should not verify 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - one argument - was called twice should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - one argument - was called twice should find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - one argument - was called twice should not find 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - one argument - was called twice should not find 1 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - one argument - was called twice should not find 3 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg), Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - one argument - was called twice should verify first arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify first arg called 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify first arg called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify first arg called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify first arg called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should verify first arg called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg1);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg1), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify second arg was called', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify second arg was called 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify second arg was called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify second arg was called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 1 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should verify second arg was called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 3 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg2), Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg was called 1 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg3), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg was called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg3), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should verify with another arg was called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(arg3), Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify for 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify for 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should verify for 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should verify', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should verify for 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should not verify for 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called should not verify for 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 1 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should verify for 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called twice should verify', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 3 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3), Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify first set', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify first set 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify first set 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify first set 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify second set', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify second set 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify second set 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]), Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify second set 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]), Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]), Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify another set 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]), Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - complex test', function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        var argSet = [{}, {}, {}, {}, {}, {}];

        // Act
        context.testObject.noArgumentsFunction();
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[2]);
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        context.testObject.noArgumentsFunction();
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.noArgumentsFunction();
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        context.testObject.noArgumentsFunction();
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[1]);
        context.testObject.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[2]);
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        context.testObject.oneArgumentsFunction(argSet[2]);

        // Assert
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction()), true, 'no arguments function should be verified');
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), false, 'no arguments function should not be verified for 0');
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(1)), false, 'no arguments function should not be verified for 1');
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(2)), false, 'no arguments function should not be verified for 2');
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(3)), false, 'no arguments function should not be verified for 3');
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(4)), true), 'no arguments function should be verified for 4';
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(5)), false, 'no arguments function should not be verified for 5');
        assert.strictEqual(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(6)), false, 'no arguments function should not be verified for 6');

        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[0])), true, 'one arguments function should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[1])), true, 'one arguments function should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2])), true, 'one arguments function should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[3])), false, 'one arguments function should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(0)), false, 'one arguments function should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(1)), false, 'one arguments function should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(2)), false, 'one arguments function not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(3)), true, 'one arguments function should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[0]), Times.exact(4)), false, 'one arguments function should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(0)), false, 'one arguments function should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(1)), true, 'one arguments function should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(2)), false, 'one arguments function should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[1]), Times.exact(3)), false, 'one arguments function should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(0)), false, 'one arguments function should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(1)), false, 'one arguments function should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(2)), false, 'one arguments function should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(3)), true, 'one arguments function should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(4)), false, 'one arguments function should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(_ => _.oneArgumentsFunction(argSet[2]), Times.exact(5)), false, 'one arguments function should not be verified for argSet[2] 5 times');

        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2])), true, 'many arguments function should be verified for argSet[0,1,2]');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(0)), false, 'many arguments function should not be verified for argSet[0,1,2] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,1,2] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(2)), false, 'many arguments function should not be verified for argSet[0,1,2] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(3)), true, 'many arguments function should be verified for argSet[0,1,2] 3 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(4)), false, 'many arguments function should not be verified for argSet[0,1,2] 4 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]), Times.exact(5)), false, 'many arguments function should not be verified for argSet[0,1,2] 5 times');

        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0])), true, 'many arguments function should be verified for argSet[0,1,0]');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(0)), false, 'many arguments function should not be verified for argSet[0,1,0] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,1,0] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(2)), true, 'many arguments function should be verified for argSet[0,1,0] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(3)), false, 'many arguments function should not be verified for argSet[0,1,0] 3 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]), Times.exact(4)), false, 'many arguments function should not be verified for argSet[0,1,0] 4 times');

        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1])), true, 'many arguments function should not be verified for argSet[1,1,1]');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(0)), false, 'many arguments function should not be verified for argSet[1,1,1] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(1)), true, 'many arguments function should be verified for argSet[1,1,1] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(2)), false, 'many arguments function should not be verified for argSet[1,1,1] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]), Times.exact(3)), false, 'many arguments function should not be verified for argSet[1,1,1] 3 times');

        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2])), true, 'many arguments function should be verified for argSet[2,1,2]');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(0)), false, 'many arguments function should not be verified for argSet[2,1,2] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(1)), true, 'many arguments function should be verified for argSet[2,1,2] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(2)), false, 'many arguments function should not be verified for argSet[2,1,2] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]), Times.exact(3)), false, 'many arguments function should not be verified for argSet[2,1,2] 3 times');

        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2])), true, 'many arguments function should be verified for argSet[2,2,2]');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(0)), false, 'many arguments function should not be verified for argSet[2,2,2] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(1)), true, 'many arguments function should be verified for argSet[2,2,2] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(2)), false, 'many arguments function should not be verified for argSet[2,2,2] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]), Times.exact(3)), false, 'many arguments function should not be verified for argSet[2,2,2] 3 times');

        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0])), false, 'many arguments function should not be verified for argSet[0,0,0]');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(0)), true, 'many arguments function should be verified for argSet[0,0,0] 0 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,0,0] 1 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(2)), false, 'many arguments function should not be verified for argSet[0,0,0] 2 times');
        assert.strictEqual(context.mole.verify(_ => _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]), Times.exact(3)), false, 'many arguments function should not be verified for argSet[0,0,0] 3 times');
    });

    QUnit.test('verify - times returns false should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var timesMole: ITimes = {
            match: () => { return false; }
        };

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), timesMole);

        // Assert
        assert.strictEqual(result, false, 'should return false if times do not match');
    });

    QUnit.test('verify - times returns true should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var timesMole: ITimes = {
            match: () => { return true; }
        };

        // Act
        var result = context.mole.verify(_ => _.noArgumentsFunction(), timesMole);

        // Assert
        assert.strictEqual(result, true, 'should return true if times match');
    });

    QUnit.test('verify - one argument - ItIsBase returns false should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var itIs = new ItIsBase();
        itIs.match = () => false;

        context.testObject.oneArgumentsFunction(1);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(itIs));

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - one argument - ItIsBase returns false should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var itIs = new ItIsBase();
        itIs.match = () => true;

        context.testObject.oneArgumentsFunction(1);

        // Act
        var result = context.mole.verify(_ => _.oneArgumentsFunction(itIs));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - many arguments - ItIsBase returns false should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var itIs = new ItIsBase();
        itIs.match = () => false;

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(itIs, itIs, itIs));

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var itIs = new ItIsBase();
        itIs.match = () => true;

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(itIs, itIs, itIs));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true and false should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = () => true;

        var falseItIs = new ItIsBase();
        falseItIs.match = () => false;

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(trueItIs, trueItIs, falseItIs));

        // Assert
        assert.strictEqual(result, false, 'should return false if some ItIs returns false');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true and other arguments dont match should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = () => true;

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(trueItIs, trueItIs, 2));

        // Assert
        assert.strictEqual(result, false, 'should return false if some arguments dont match');
    });

    QUnit.test('verify - many arguments - called many times ItIsBase returns true should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = () => true;

        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(trueItIs, trueItIs, 2), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true and the times match');
    });

    QUnit.test('verify - many arguments - called many times ItIsBase returns true once should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var trueItIs = new ItIsBase();
        var numberOfTimesReturnedTrue = 0;
        trueItIs.match = () => {
            numberOfTimesReturnedTrue++;
            return numberOfTimesReturnedTrue <= 1;
        };

        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(1, trueItIs, 2), Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true and the times match');
    });

    QUnit.test('verify - many arguments - called with numbers and strings should return only the strings', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var numberItIs = It.isAny(Number);
        var stringItIs = It.isAny(String);

        context.testObject.manyArgumentsFunction(11, 1, 1);
        context.testObject.manyArgumentsFunction(12, 1, 2);
        context.testObject.manyArgumentsFunction(13, '1', 3);
        context.testObject.manyArgumentsFunction(14, 1, 4);
        context.testObject.manyArgumentsFunction(15, '112', 5);
        context.testObject.manyArgumentsFunction(16, 1, 6);

        // Act
        var result = context.mole.verify(_ => _.manyArgumentsFunction(numberItIs, stringItIs, numberItIs), Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should return true for 2 string calls');
    });

    QUnit.test('verifyPrivate - should verify only the private function', 3, function (assert: QUnitAssert) {

        // Arrange
        var context: MoleLifecycleObject = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.callPrivateFunction(1);

        // Assert
        var verifyPrivateFunction = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [1]);
        var verifyOneArguments = context.mole.verify(_ => _.oneArgumentsFunction(arg1));
        var verifyManyArguments = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        assert.strictEqual(verifyPrivateFunction, true, 'private function should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verifyPrivate - should verify only the many argument function', 3, function (assert: QUnitAssert) {

        // Arrange
        var context: MoleLifecycleObject = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        var verifyPrivateFunction = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [It.isAny(Object)]);
        var verifyOneArguments = context.mole.verify(_ => _.oneArgumentsFunction(arg1));
        var verifyManyArguments = context.mole.verify(_ => _.manyArgumentsFunction(arg1, arg2, arg3));

        assert.strictEqual(verifyPrivateFunction, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
    });

    QUnit.test('verifyPrivate - was not called should not find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should not find 1 match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should not find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should find 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verifyPrivate - was called should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verifyPrivate - was called should find 1 match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verifyPrivate - was called should not find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verifyPrivate - was called should not verify 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verifyPrivate - was called twice should find a match', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verifyPrivate - was called twice should find 2 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verifyPrivate - was called twice should not find 0 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verifyPrivate - was called twice should not find 1 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verifyPrivate - was called twice should not find 3 matches', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verifyPrivate - was called twice should verify first arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1]);

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify first arg called 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify first arg called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify first arg called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify first arg called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should verify first arg called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg1);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify second arg was called', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2]);

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify second arg was called 1 time', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify second arg was called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify second arg was called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 1 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should verify second arg was called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 3 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3]);

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg was called 1 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg was called 2 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify with another arg was called 0 times', function (assert: QUnitAssert) {
        QUnit.expect(1);

        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - times returns false should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var timesMole: ITimes = {
            match: () => { return false; }
        };

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

        // Assert
        assert.strictEqual(result, false, 'should return false if times do not match');
    });

    QUnit.test('verifyPrivate - times returns true should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var timesMole: ITimes = {
            match: () => { return true; }
        };

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

        // Assert
        assert.strictEqual(result, true, 'should return true if times match');
    });

    QUnit.test('verifyPrivate - one argument - ItIsBase returns false should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var itIs = new ItIsBase();
        itIs.match = () => false;

        context.testObject.callPrivateFunction(1);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verifyPrivate - one argument - ItIsBase returns false should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var itIs = new ItIsBase();
        itIs.match = () => true;

        context.testObject.callPrivateFunction(1);

        // Act
        var result = context.mole.verifyPrivate(TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('callBase - set to true after constructor should call the original function', 1, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(true, 'original function should be called');
        }

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('callBase - set to false after constructor should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'original function should not be called');
        }

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('callBase - set to true should return the original function value', 1, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.strictEqual(result, 1, 'should return the original value');
    });

    QUnit.test('callBase - set to false should not return the original function value', 1, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.notStrictEqual(result, 1, 'should not return the original value');
    });

    QUnit.test('callBase - set to false should return undefined', 1, function (assert: QUnitAssert) {
        // Arrange
        var testObject = new TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setup - callback - should not call callback if function is not called', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should call callback when function is called', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should pass the same parameters', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 1;

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback((_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - should pass the same parameters 2', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
            .callback((_arg1, _arg2, _arg3) => {
                // Assert
                assert.strictEqual(_arg1, arg1, 'should return same argument');
                assert.strictEqual(_arg2, arg2, 'should return same argument');
                assert.strictEqual(_arg3, arg3, 'should return same argument');
            });

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - callback - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not return the callback return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.returning1Function()).callback(() => {
            return {};
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(() => {
                // Assert
                assert.ok(true, 'should call callback');
            }).callback(() => {
                // Assert
                assert.ok(true, 'should call callback');
            }).callback(() => {
                // Assert
                assert.ok(true, 'should call callback');
            });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should pass teh same parameters to all the callbacks when function is called', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 12;

        var checkArgument = (_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass same argument');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .callback(checkArgument)
            .callback(checkArgument)
            .callback(checkArgument)
            .callback(checkArgument);

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - should pass teh same parameters to all the callbacks when function is called 2', 12, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 11;
        var arg2 = 12;
        var arg3 = 13;

        var checkArgument = (_arg1, _arg2, _arg3) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should pass same argument');
            assert.strictEqual(_arg2, arg2, 'should pass same argument');
            assert.strictEqual(_arg3, arg3, 'should pass same argument');
        };

        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
            .callback(checkArgument)
            .callback(checkArgument)
            .callback(checkArgument)
            .callback(checkArgument);

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - callback - should not affect verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => { });

        // Assert
        assert.ok(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - returns - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returns(111);

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returns(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should return the value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        context.mole.setup(_ => _.returning1Function()).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - returns - should return the last returns value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setup(_ => _.returning1Function()).returns(returnValue1);
        context.mole.setup(_ => _.returning1Function()).returns(returnValue2);
        context.mole.setup(_ => _.returning1Function()).returns(returnValue3);
        context.mole.setup(_ => _.returning1Function()).returns(returnValue4);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - returns - should not affect verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).returns(4);

        // Assert
        assert.ok(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - returnsInOrder - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([111]);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).returns([111]);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should return the values', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        context.mole.setup(_ => _.returning1Function()).returnsInOrder([returnValue1, returnValue2, returnValue3]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue1, 'should return the configured value1');
        assert.strictEqual(result2, returnValue2, 'should return the configured value2');
        assert.strictEqual(result3, returnValue3, 'should return the configured value3');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - returnsInOrder - should return the last returns values', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        context.mole.setup(_ => _.returning1Function()).returns(returnValue1);
        context.mole.setup(_ => _.returning1Function()).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        context.mole.setup(_ => _.returning1Function()).returnsInOrder([returnValue5, returnValue6, returnValue7]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - returnsInOrder - should not affect verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).returnsInOrder([4]);

        // Assert
        assert.ok(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - lazyReturns - should not call returnFunction if function is not called', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setup - lazyReturns - should call returnFunction when function is called', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should pass the same parameters', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 1;

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns((_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - lazyReturns - should pass the same parameters 2', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
            .lazyReturns((_arg1, _arg2, _arg3) => {
                // Assert
                assert.strictEqual(_arg1, arg1, 'should return same argument');
                assert.strictEqual(_arg2, arg2, 'should return same argument');
                assert.strictEqual(_arg3, arg3, 'should return same argument');
            });

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - lazyReturns - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should return the returnFunction return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setup(_ => _.returning1Function()).lazyReturns(() => {
            return returnValue;
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return returnValue');
    });

    QUnit.test('setup - lazyReturns - should return the last returnFunction return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setup(_ => _.returning1Function())
            .lazyReturns(() => { return returnValue1; })
            .lazyReturns(() => { return returnValue2; })
            .lazyReturns(() => { return returnValue3; })
            .lazyReturns(() => { return returnValue4; });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturns - should not affect verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => 4);

        // Assert
        assert.ok(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call returnFunction if function is not called', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        }]);
    });

    QUnit.test('setup - lazyReturnsInOrder - should call returnFunction when function is called', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var functionThatWasCalled = [];
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([
            () => functionThatWasCalled.push(1),
            () => functionThatWasCalled.push(2),
            () => functionThatWasCalled.push(3)]);

        // Act
        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Assert
        assert.strictEqual(functionThatWasCalled.length, 3, 'there should be only 3 function calls');
        assert.strictEqual(functionThatWasCalled[0], 1, 'should be function number 1');
        assert.strictEqual(functionThatWasCalled[1], 2, 'should be function number 2');
        assert.strictEqual(functionThatWasCalled[2], 3, 'should be function number 3');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should pass the same parameters', 2, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 1;
        var arg2 = 2;

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturnsInOrder([(_arg1) => {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        }, (_arg2) => {
                // Assert
                assert.strictEqual(_arg2, arg2, 'should return same argument');
            }]);

        // Act
        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
    });

    QUnit.test('setup - lazyReturnsInOrder - should pass the same parameters 2', 6, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg11 = 1;
        var arg12 = 2;
        var arg13 = 3;
        var arg21 = 4;
        var arg22 = 5;
        var arg23 = 6;

        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number)))
            .lazyReturnsInOrder([(_arg11, _arg12, _arg13) => {
                // Assert
                assert.strictEqual(_arg11, arg11, 'should return same argument');
                assert.strictEqual(_arg12, arg12, 'should return same argument');
                assert.strictEqual(_arg13, arg13, 'should return same argument');
            }, (_arg21, _arg22, _arg23) => {
                    // Assert
                    assert.strictEqual(_arg21, arg21, 'should return same argument');
                    assert.strictEqual(_arg22, arg22, 'should return same argument');
                    assert.strictEqual(_arg23, arg23, 'should return same argument');
                }]);

        // Act
        context.testObject.manyArgumentsFunction(arg11, arg12, arg13);
        context.testObject.manyArgumentsFunction(arg21, arg22, arg23);
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => { }]);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should return the returnFunction return values', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};

        context.mole.setup(_ => _.returning1Function()).lazyReturnsInOrder([
            () => returnValue1,
            () => returnValue2,
            () => returnValue3
        ]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue1, 'should return returnValue1');
        assert.strictEqual(result2, returnValue2, 'should return returnValue2');
        assert.strictEqual(result3, returnValue3, 'should return returnValue3');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - lazyReturnsInOrder - should return the last returnFunction return values', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        context.mole.setup(_ => _.returning1Function())
            .lazyReturns(() => { return returnValue1; })
            .lazyReturns(() => { return returnValue2; })
            .lazyReturnsInOrder([() => returnValue3, () => returnValue4])
            .lazyReturnsInOrder([() => returnValue5, () => returnValue6, () => returnValue7]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not affect verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturnsInOrder([() => 4]);

        // Assert
        assert.ok(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - throws - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).throws(111);

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        try {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.noArgumentsFunction()).throws(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should throw the error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError = {};
        context.mole.setup(_ => _.returning1Function()).throws(thrownError);

        // Act
        try {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(_ => _.returning1Function())
            .throws(thrownError1)
            .throws(thrownError2)
            .throws(thrownError3)
            .throws(thrownError4);

        // Act
        try {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should not affect verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setup(_ => _.noArgumentsFunction()).throws('error');

        // Assert
        assert.ok(context.mole.verify(_ => _.noArgumentsFunction(), Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - mix - should throw error if configured after return', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(_ => _.returning1Function())
            .returns(returnValue)
            .throws(thrownError);

        // Act
        try {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the error');
        }
    });

    QUnit.test('setup - mix - should return value if configured after throw', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(_ => _.returning1Function())
            .throws(thrownError)
            .returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but return last configured one', 5, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(_ => _.returning1Function())
            .throws(thrownError)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 1;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 2;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 3;
            })
            .callback(() => assert.ok(true, 'should call callback'))
            .returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but return last configured one 2', 5, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(_ => _.returning1Function())
            .throws(thrownError)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 1;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 2;
            })
            .returns(3)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return returnValue;
            })
            .callback(() => assert.ok(true, 'should call callback'));

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but throw last configured error', 5, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(_ => _.returning1Function())
            .throws('asdasd')
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 1;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 2;
            })
            .returns(returnValue)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 3;
            })
            .throws(thrownError)
            .callback(() => assert.ok(true, 'should call callback'));

        // Act
        try {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setup - mix - should not affect the verify', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        // Act
        context.mole.setup(_ => _.returning1Function())
            .throws('asdasd')
            .lazyReturns(() => 1)
            .lazyReturns(() => 2)
            .lazyReturns(() => 3)
            .throws(thrownError)
            .returns(returnValue)
            .callback(() => { });

        // Assert
        assert.ok(context.mole.verify(_ => _.returning1Function(), Times.exact(0)), 'should be called once');
    });

    QUnit.test('setup - mix - should call only the matching set', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .lazyReturns(() => {
                assert.ok(false, 'lazyReturns should not be called for any number');
            })
            .returns('return value')
            .callback(() => {
                assert.ok(false, 'callback should not be called for any number');
            });

        context.mole.setup(_ => _.oneArgumentsFunction('aaa'))
            .throws('error')
            .lazyReturns(() => {
                assert.ok(false, 'lazyReturns should not be called aaa');
            })
            .callback(() => {
                assert.ok(false, 'callback should not be called for aaa');
            });

        context.mole.setup(_ => _.oneArgumentsFunction('bbb'))
            .lazyReturns(() => {
                assert.ok(true, 'should be called');
            })
            .callback(() => {
                assert.ok(true, 'should be called');
            })
            .returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction('bbb');

        // Assert
        assert.strictEqual(result, returnValue, 'should return the return value');
    });

    QUnit.test('setup - mix - if both setups match should call both', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .lazyReturns(() => {
                assert.ok(true, 'should call');
            })
            .returns('return value')
            .callback(() => {
                assert.ok(true, 'should call');
            });

        context.mole.setup(_ => _.oneArgumentsFunction(1))
            .lazyReturns(() => {
                assert.ok(true, 'should call');
            })
            .returns('return value')
            .callback(() => {
                assert.ok(true, 'should call');
            });

        // Act
        context.testObject.oneArgumentsFunction(1);
    });

    QUnit.test('setup - mix - if both setups match should return from the last', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .lazyReturns(() => 1)
            .returns(() => 2);

        context.mole.setup(_ => _.oneArgumentsFunction(1))
            .lazyReturns(() => 3)
            .returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setup - mix - if both setups match should return from the last 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setup(_ => _.oneArgumentsFunction(1))
            .lazyReturns(() => 1)
            .returns(() => 2);

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .lazyReturns(() => 3)
            .returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setup - mix - if both setups match should throw from the last', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError = {};

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .lazyReturns(() => 1)
            .throws('error')
            .returns(() => 2);

        context.mole.setup(_ => _.oneArgumentsFunction(1))
            .lazyReturns(() => 3)
            .throws(thrownError);

        // Act
        try {
            context.testObject.oneArgumentsFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setup - mix - if both setups match should throw from the last 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError = {};

        context.mole.setup(_ => _.oneArgumentsFunction(1))
            .lazyReturns(() => 1)
            .throws('error')
            .returns(() => 2);

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number)))
            .lazyReturns(() => 3)
            .throws(thrownError);

        // Act
        try {
            context.testObject.oneArgumentsFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setupPrivate - callback - should not call callback if function is not called', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME).callback(() => {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should call callback when function is called', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        context.testObject.onPrivateFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 1;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback((_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 2;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 2)
            .callback((_arg1) => {
                // Assert
                assert.strictEqual(_arg1, arg1, 'should return same argument');
            });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 'some text';

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(() => {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching 2', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 3;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 2)
            .callback(() => {
                // Assert
                assert.ok(false, 'should not be called');
            });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching 3', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 3;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME)
            .callback(() => {
                // Assert
                assert.ok(false, 'should not be called');
            });

        // Act
        context.testObject.callPrivateFunction(undefined);
    });

    QUnit.test('setupPrivate - callback - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, null).callback(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - callback - should not return the callback return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => {
            return {};
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setupPrivate - callback - should call all the callbacks when function is called', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).callback(() => {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(() => {
                // Assert
                assert.ok(true, 'should call callback');
            }).callback(() => {
                // Assert
                assert.ok(true, 'should call callback');
            }).callback(() => {
                // Assert
                assert.ok(true, 'should call callback');
            });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - callback - should pass teh same parameters to all the callbacks when function is called', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 12;

        var checkArgument = (_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass same argument');
        };

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .callback(checkArgument)
            .callback(checkArgument)
            .callback(checkArgument)
            .callback(checkArgument);

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - returns - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        context.testObject.onPrivateFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should return the value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - returns - should return the last returns value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue1);
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue2);
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue3);
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - should not call returnFunction if function is not called', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        // Act
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setupPrivate - lazyReturns - should call returnFunction when function is called', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        context.testObject.onPrivateFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should pass the same parameters', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg = 1;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns((_arg) => {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - lazyReturns - should pass the same parameters 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var arg1 = 1;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, arg1)
            .lazyReturns((_arg1, _arg2, _arg3) => {
                // Assert
                assert.strictEqual(_arg1, arg1, 'should return same argument');
            });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => { });

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should return the returnFunction return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(() => {
            return returnValue;
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - should return the last returnFunction return value', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .lazyReturns(() => { return returnValue1; })
            .lazyReturns(() => { return returnValue2; })
            .lazyReturns(() => { return returnValue3; })
            .lazyReturns(() => { return returnValue4; });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - throws - should not call the original function', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        context.testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call other original functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call callbacks on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).callback(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call lazyReturns on other functions', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = () => {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(_ => _.oneArgumentsFunction(It.isAny(Number))).lazyReturns(shouldNotHappen);
        context.mole.setup(_ => _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number))).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError = {};
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError);

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the last error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .throws(thrownError1)
            .throws(thrownError2)
            .throws(thrownError3)
            .throws(thrownError4);

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - mix - should throw error if configured after return', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .returns(returnValue)
            .throws(thrownError);

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the error');
        }
    });

    QUnit.test('setupPrivate - mix - should return value if configured after throw', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .throws(thrownError)
            .returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but return last configured one', 5, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .throws(thrownError)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 1;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 2;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 3;
            })
            .callback(() => assert.ok(true, 'should call callback'))
            .returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but return last configured one 2', 5, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .throws(thrownError)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 1;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 2;
            })
            .returns(3)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return returnValue;
            })
            .callback(() => assert.ok(true, 'should call callback'));

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but throw last configured error', 5, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .throws('asdasd')
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 1;
            })
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 2;
            })
            .returns(returnValue)
            .lazyReturns(() => {
                assert.ok(true, 'should call lazyRerturns');
                return 3;
            })
            .throws(thrownError)
            .callback(() => assert.ok(true, 'should call callback'));

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - mix - should call only the matching set', 3, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .lazyReturns(() => {
                assert.ok(false, 'lazyReturns should not be called for any number');
            })
            .returns('return value')
            .callback(() => {
                assert.ok(false, 'callback should not be called for any number');
            });

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 'aaa')
            .throws('error')
            .lazyReturns(() => {
                assert.ok(false, 'lazyReturns should not be called aaa');
            })
            .callback(() => {
                assert.ok(false, 'callback should not be called for aaa');
            });

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 'bbb')
            .lazyReturns(() => {
                assert.ok(true, 'should be called');
            })
            .callback(() => {
                assert.ok(true, 'should be called');
            })
            .returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction('bbb');

        // Assert
        assert.strictEqual(result, returnValue, 'should return the return value');
    });

    QUnit.test('setupPrivate - mix - if both setups match should call both', 4, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .lazyReturns(() => {
                assert.ok(true, 'should call');
            })
            .returns('return value')
            .callback(() => {
                assert.ok(true, 'should call');
            });

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .lazyReturns(() => {
                assert.ok(true, 'should call');
            })
            .returns('return value')
            .callback(() => {
                assert.ok(true, 'should call');
            });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - mix - if both setups match should return from the last', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .lazyReturns(() => 1)
            .returns(() => 2);

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .lazyReturns(() => 3)
            .returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setupPrivate - mix - if both setups match should return from the last 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var returnValue = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .lazyReturns(() => 1)
            .returns(() => 2);

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .lazyReturns(() => 3)
            .returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setupPrivate - mix - if both setups match should throw from the last', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .lazyReturns(() => 1)
            .throws('error')
            .returns(() => 2);

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .lazyReturns(() => 3)
            .throws(thrownError);

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setupPrivate - mix - if both setups match should throw from the last 2', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var thrownError = {};

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, 1)
            .lazyReturns(() => 1)
            .throws('error')
            .returns(() => 2);

        context.mole.setupPrivate(TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number))
            .lazyReturns(() => 3)
            .throws(thrownError);

        // Act
        try {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('isStrict - true - no setup should throw error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = true;

        try {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - has callbeck setup should call the callback and not throw error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = true;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            assert.ok(true, 'should call the setup');
        });

        try {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has lazyReturns setup should call the lazyReturns and not throw error', 2, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = true;

        var returnValue = {};
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
            assert.ok(true, 'should call the lazyReturns');
            return returnValue;
        });

        try {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has returns setup should return the returnValue and not throw error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = true;

        var returnValue = {};
        context.mole.setup(_ => _.noArgumentsFunction()).returns(returnValue);

        try {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has throws setup should throw the thrownError', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = true;

        var thrownError = {};
        context.mole.setup(_ => _.noArgumentsFunction()).throws(thrownError);

        try {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrown error');
        }
    });

    QUnit.test('isStrict - false - no setup should not throw error', 0, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = false;

        try {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has callbeck setup should call the callback and not throw error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = false;

        context.mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            assert.ok(true, 'should call the setup');
        });

        try {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has lazyReturns setup should call the lazyReturns and not throw error', 2, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = false;

        var returnValue = {};
        context.mole.setup(_ => _.noArgumentsFunction()).lazyReturns(() => {
            assert.ok(true, 'should call the lazyReturns');
            return returnValue;
        });

        try {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has returns setup should return the returnValue and not throw error', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = false;

        var returnValue = {};
        context.mole.setup(_ => _.noArgumentsFunction()).returns(returnValue);

        try {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has throws setup should throw the thrownError', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;
        context.mole.isStrict = false;

        var thrownError = {};
        context.mole.setup(_ => _.noArgumentsFunction()).throws(thrownError);

        try {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrown error');
        }
    });

    QUnit.test('staticFunction - Override static function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var mole = new Mole<any>(TestObject);

        // Act
        mole.setup(_ => { TestObject.staticFunction(); }).callback(() => {
            // Assert
            assert.ok(true, 'should call callback');
        });

        TestObject.staticFunction();
    });

    QUnit.test('setup - inheritence - callback on sons function should call callback', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var testObjectSon = new TestObjectSon();
        var mole = new Mole<TestObjectSon>(testObjectSon);

        // Act
        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            // Assert
            assert.ok(true, 'callbeck was called');
        });

        testObjectSon.noArgumentsFunction();
    });

    QUnit.test('dispose - before dispose should not call the original function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var testObject = new TestObject();
        var mole = new Mole<TestObject>(testObject);

        testObject.onNoArgumentsFunctionCalled = () => {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('dispose - should call the original function', 1, function (assert: QUnitAssert) {
        // Arrange
        var context: MoleLifecycleObject = this;

        var testObject = new TestObject();
        var mole = new Mole<TestObject>(testObject);

        testObject.onNoArgumentsFunctionCalled = () => {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(_ => _.noArgumentsFunction()).callback(() => {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.noArgumentsFunction();
    });
}