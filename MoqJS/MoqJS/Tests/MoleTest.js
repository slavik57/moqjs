'use strict';
var Tests;
(function (Tests) {
    var ItIsBase = moqJS.ItIsBase;
    var It = moqJS.It;

    var Times = moqJS.Times;
    var Mole = moqJS.Mole;

    var MoleLifecycleObject = (function () {
        function MoleLifecycleObject() {
            this.beforeEach = function () {
                var context = this;

                context.testObject = new Tests.TestObject();

                context.mole = new Mole(context.testObject);
            };
            this.afterEach = function () {
            };
        }
        return MoleLifecycleObject;
    })();

    QUnit.module('Mole', new MoleLifecycleObject());

    QUnit.test('constructor - should initialize correctly', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();

        // Act
        var mole = new Mole(testObject);

        // Assert
        assert.strictEqual(mole.object, testObject);
    });

    QUnit.test('noArgumentsFunction - should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = function () {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.testObject.onManyArgumentsFunctionCalled = function () {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('oneArgumentsFunction - one arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        context.testObject.onManyArgumentsFunctionCalled = function () {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('manyArgumentsFunction - many arguments should call only the original function', function (assert) {
        QUnit.expect(3);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = function () {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.testObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('verify - should verify only the no arguments function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.noArgumentsFunction();

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyNoArguments, true, 'no arguments should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verify - should verify only the one argument function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.oneArgumentsFunction(arg1);

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, true, 'one arguments should be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verify - should verify only the many argument function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
    });

    QUnit.test('verify - no arguments - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was not called should return true on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - no arguments - was called should return false on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - no arguments - was called should return true on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - no arguments - was called should return false on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return true on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return false on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return false on 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - one argument - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        });

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - one argument - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        });

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - one argument - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - one argument - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - one argument - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - one argument - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - one argument - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - one argument - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - one argument - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - one argument - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - one argument - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify for 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify for 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should verify for 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should verify', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should verify for 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should not verify for 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called should not verify for 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should verify for 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called twice should verify', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify first set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify first set 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify first set 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify first set 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify second set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify second set 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify second set 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify second set 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify another set 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - complex test', function (assert) {
        // Arrange
        var context = this;
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
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }), true, 'no arguments function should be verified');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), false, 'no arguments function should not be verified for 0');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(1)), false, 'no arguments function should not be verified for 1');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2)), false, 'no arguments function should not be verified for 2');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(3)), false, 'no arguments function should not be verified for 3');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(4)), true), 'no arguments function should be verified for 4';
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(5)), false, 'no arguments function should not be verified for 5');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(6)), false, 'no arguments function should not be verified for 6');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }), true, 'one arguments function should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }), true, 'one arguments function should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }), true, 'one arguments function should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[3]);
        }), false, 'one arguments function should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(0)), false, 'one arguments function should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(1)), false, 'one arguments function should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(2)), false, 'one arguments function not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(3)), true, 'one arguments function should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(4)), false, 'one arguments function should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(0)), false, 'one arguments function should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(1)), true, 'one arguments function should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(2)), false, 'one arguments function should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(3)), false, 'one arguments function should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(0)), false, 'one arguments function should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(1)), false, 'one arguments function should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(2)), false, 'one arguments function should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(3)), true, 'one arguments function should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(4)), false, 'one arguments function should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(5)), false, 'one arguments function should not be verified for argSet[2] 5 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }), true, 'many arguments function should be verified for argSet[0,1,2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[0,1,2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,1,2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[0,1,2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(3)), true, 'many arguments function should be verified for argSet[0,1,2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(4)), false, 'many arguments function should not be verified for argSet[0,1,2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(5)), false, 'many arguments function should not be verified for argSet[0,1,2] 5 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }), true, 'many arguments function should be verified for argSet[0,1,0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[0,1,0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,1,0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(2)), true, 'many arguments function should be verified for argSet[0,1,0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[0,1,0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(4)), false, 'many arguments function should not be verified for argSet[0,1,0] 4 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }), true, 'many arguments function should not be verified for argSet[1,1,1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[1,1,1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(1)), true, 'many arguments function should be verified for argSet[1,1,1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[1,1,1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[1,1,1] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }), true, 'many arguments function should be verified for argSet[2,1,2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[2,1,2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(1)), true, 'many arguments function should be verified for argSet[2,1,2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[2,1,2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[2,1,2] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }), true, 'many arguments function should be verified for argSet[2,2,2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[2,2,2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(1)), true, 'many arguments function should be verified for argSet[2,2,2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[2,2,2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[2,2,2] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }), false, 'many arguments function should not be verified for argSet[0,0,0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(0)), true, 'many arguments function should be verified for argSet[0,0,0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,0,0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[0,0,0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[0,0,0] 3 times');
    });

    QUnit.test('verify - times returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return false;
            }
        };

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, timesMole);

        // Assert
        assert.strictEqual(result, false, 'should return false if times do not match');
    });

    QUnit.test('verify - times returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return true;
            }
        };

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, timesMole);

        // Assert
        assert.strictEqual(result, true, 'should return true if times match');
    });

    QUnit.test('verify - one argument - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.oneArgumentsFunction(1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(itIs);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - one argument - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.oneArgumentsFunction(1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(itIs);
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - many arguments - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(itIs, itIs, itIs);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(itIs, itIs, itIs);
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true and false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        var falseItIs = new ItIsBase();
        falseItIs.match = function () {
            return false;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(trueItIs, trueItIs, falseItIs);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if some ItIs returns false');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true and other arguments dont match should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(trueItIs, trueItIs, 2);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if some arguments dont match');
    });

    QUnit.test('verify - many arguments - called many times ItIsBase returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(trueItIs, trueItIs, 2);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true and the times match');
    });

    QUnit.test('verify - many arguments - called many times ItIsBase returns true once should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        var numberOfTimesReturnedTrue = 0;
        trueItIs.match = function () {
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
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(1, trueItIs, 2);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true and the times match');
    });

    QUnit.test('verify - many arguments - called with numbers and strings should return only the strings', 1, function (assert) {
        // Arrange
        var context = this;

        var numberItIs = It.isAny(Number);
        var stringItIs = It.isAny(String);

        context.testObject.manyArgumentsFunction(11, 1, 1);
        context.testObject.manyArgumentsFunction(12, 1, 2);
        context.testObject.manyArgumentsFunction(13, '1', 3);
        context.testObject.manyArgumentsFunction(14, 1, 4);
        context.testObject.manyArgumentsFunction(15, '112', 5);
        context.testObject.manyArgumentsFunction(16, 1, 6);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(numberItIs, stringItIs, numberItIs);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should return true for 2 string calls');
    });

    QUnit.test('verifyPrivate - should verify only the private function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.callPrivateFunction(1);

        // Assert
        var verifyPrivateFunction = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [1]);
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyPrivateFunction, true, 'private function should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verifyPrivate - should verify only the many argument function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        var verifyPrivateFunction = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [It.isAny(Object)]);
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyPrivateFunction, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
    });

    QUnit.test('verifyPrivate - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verifyPrivate - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verifyPrivate - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verifyPrivate - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verifyPrivate - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verifyPrivate - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verifyPrivate - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verifyPrivate - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verifyPrivate - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verifyPrivate - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verifyPrivate - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1]);

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg1);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2]);

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3]);

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - times returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return false;
            }
        };

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

        // Assert
        assert.strictEqual(result, false, 'should return false if times do not match');
    });

    QUnit.test('verifyPrivate - times returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return true;
            }
        };

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

        // Assert
        assert.strictEqual(result, true, 'should return true if times match');
    });

    QUnit.test('verifyPrivate - one argument - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.callPrivateFunction(1);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verifyPrivate - one argument - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.callPrivateFunction(1);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('callBase - set to true after constructor should call the original function', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'original function should be called');
        };

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('callBase - set to false after constructor should not call the original function', 0, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'original function should not be called');
        };

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('callBase - set to true should return the original function value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.strictEqual(result, 1, 'should return the original value');
    });

    QUnit.test('callBase - set to false should not return the original function value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.notStrictEqual(result, 1, 'should not return the original value');
    });

    QUnit.test('callBase - set to false should return undefined', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setup - callback - should not call callback if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should call callback when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - should pass the same parameters 2', 3, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
            assert.strictEqual(_arg2, arg2, 'should return same argument');
            assert.strictEqual(_arg3, arg3, 'should return same argument');
        });

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - callback - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not return the callback return value', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).callback(function () {
            return {};
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should pass teh same parameters to all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        var arg = 12;

        var checkArgument = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass same argument');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(checkArgument).callback(checkArgument).callback(checkArgument).callback(checkArgument);

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - should pass teh same parameters to all the callbacks when function is called 2', 12, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 11;
        var arg2 = 12;
        var arg3 = 13;

        var checkArgument = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should pass same argument');
            assert.strictEqual(_arg2, arg2, 'should pass same argument');
            assert.strictEqual(_arg3, arg3, 'should pass same argument');
        };

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(checkArgument).callback(checkArgument).callback(checkArgument).callback(checkArgument);

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - callback - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - returns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should return the value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - returns - should return the last returns value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue1);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue2);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue3);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue4);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - returns - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(4);

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - lazyReturns - should not call returnFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setup - lazyReturns - should call returnFunction when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - lazyReturns - should pass the same parameters 2', 3, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
            assert.strictEqual(_arg2, arg2, 'should return same argument');
            assert.strictEqual(_arg3, arg3, 'should return same argument');
        });

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - lazyReturns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should return the returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturns(function () {
            return returnValue;
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return returnValue');
    });

    QUnit.test('setup - lazyReturns - should return the last returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturns(function () {
            return returnValue3;
        }).lazyReturns(function () {
            return returnValue4;
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturns - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - throws - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should throw the error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError);

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws('error');

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - mix - should throw error if configured after return', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue).throws(thrownError);

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the error');
        }
    });

    QUnit.test('setup - mix - should return value if configured after throw', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but return last configured one', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        }).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but return last configured one 2', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(3).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return returnValue;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but throw last configured error', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws('asdasd').lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(returnValue).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).throws(thrownError).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setup - mix - should not affect the verify', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        // Act
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws('asdasd').lazyReturns(function () {
            return 1;
        }).lazyReturns(function () {
            return 2;
        }).lazyReturns(function () {
            return 3;
        }).throws(thrownError).returns(returnValue).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.returning1Function();
        }, Times.exact(0)), 'should be called once');
    });

    QUnit.test('setup - mix - should call only the matching set', 3, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called for any number');
        }).returns('return value').callback(function () {
            assert.ok(false, 'callback should not be called for any number');
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction('aaa');
        }).throws('error').lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called aaa');
        }).callback(function () {
            assert.ok(false, 'callback should not be called for aaa');
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction('bbb');
        }).lazyReturns(function () {
            assert.ok(true, 'should be called');
        }).callback(function () {
            assert.ok(true, 'should be called');
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction('bbb');

        // Assert
        assert.strictEqual(result, returnValue, 'should return the return value');
    });

    QUnit.test('setup - mix - if both setups match should call both', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.oneArgumentsFunction(1);
    });

    QUnit.test('setup - mix - if both setups match should return from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setup - mix - if both setups match should return from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setup - mix - if both setups match should throw from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.oneArgumentsFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setup - mix - if both setups match should throw from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.oneArgumentsFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setupPrivate - callback - should not call callback if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should call callback when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
        });

        context.testObject.onPrivateFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters 2', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 2;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 2).callback(function (_arg1) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching', 0, function (assert) {
        // Arrange
        var context = this;

        var arg = 'some text';

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching 2', 0, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 3;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 2).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching 3', 0, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 3;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(undefined);
    });

    QUnit.test('setupPrivate - callback - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - callback - should not return the callback return value', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
            return {};
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setupPrivate - callback - should call all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - callback - should pass teh same parameters to all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        var arg = 12;

        var checkArgument = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass same argument');
        };

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(checkArgument).callback(checkArgument).callback(checkArgument).callback(checkArgument);

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - returns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        context.testObject.onPrivateFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should return the value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - returns - should return the last returns value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue1);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue2);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue3);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - should not call returnFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setupPrivate - lazyReturns - should call returnFunction when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        context.testObject.onPrivateFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - lazyReturns - should pass the same parameters 2', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, arg1).lazyReturns(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should return the returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return returnValue;
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - should return the last returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturns(function () {
            return returnValue3;
        }).lazyReturns(function () {
            return returnValue4;
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - throws - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the last error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - mix - should throw error if configured after return', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the error');
        }
    });

    QUnit.test('setupPrivate - mix - should return value if configured after throw', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but return last configured one', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but return last configured one 2', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(3).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return returnValue;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but throw last configured error', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws('asdasd').lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(returnValue).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).throws(thrownError).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - mix - should call only the matching set', 3, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called for any number');
        }).returns('return value').callback(function () {
            assert.ok(false, 'callback should not be called for any number');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 'aaa').throws('error').lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called aaa');
        }).callback(function () {
            assert.ok(false, 'callback should not be called for aaa');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 'bbb').lazyReturns(function () {
            assert.ok(true, 'should be called');
        }).callback(function () {
            assert.ok(true, 'should be called');
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction('bbb');

        // Assert
        assert.strictEqual(result, returnValue, 'should return the return value');
    });

    QUnit.test('setupPrivate - mix - if both setups match should call both', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - mix - if both setups match should return from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setupPrivate - mix - if both setups match should return from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setupPrivate - mix - if both setups match should throw from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setupPrivate - mix - if both setups match should throw from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('isStrict - true - no setup should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - has callbeck setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has lazyReturns setup should call the lazyReturns and not throw error', 2, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            assert.ok(true, 'should call the lazyReturns');
            return returnValue;
        });

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has returns setup should return the returnValue and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(returnValue);

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has throws setup should throw the thrownError', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        var thrownError = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(thrownError);

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrown error');
        }
    });

    QUnit.test('isStrict - false - no setup should not throw error', 0, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has callbeck setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has lazyReturns setup should call the lazyReturns and not throw error', 2, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            assert.ok(true, 'should call the lazyReturns');
            return returnValue;
        });

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has returns setup should return the returnValue and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(returnValue);

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has throws setup should throw the thrownError', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        var thrownError = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(thrownError);

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrown error');
        }
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=MoleTest.js.map
