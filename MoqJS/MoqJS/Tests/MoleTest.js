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
                var context = this;

                context.mole.dispose();
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

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('oneArgumentsFunction - one arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        var arg = {};

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('manyArgumentsFunction - many arguments should call only the original function', function (assert) {
        QUnit.expect(3);

        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;

        context.testObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('getter - should call only the original getter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;

        context.testObject.onGetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};
        context.testObject.getterValue = value;

        // Act
        var actualValue = context.testObject.getter;

        // Assert
        assert.strictEqual(actualValue, value, 'Should return the getter value');
    });

    QUnit.test('setter - should call only the original setter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;

        context.testObject.onSetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};

        // Act
        context.testObject.setter = value;

        // Assert
        assert.strictEqual(context.testObject.setterValue, value, 'Should set the setter value');
    });

    QUnit.test('getter&setter - setter - should call only the original setter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;

        context.testObject.onSetterOfGetterAndSetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};

        // Act
        context.testObject.getterAndSetter = value;

        // Assert
        assert.strictEqual(context.testObject.getterAndSetterValue, value, 'Should set the value');
    });

    QUnit.test('getter&setter - getter - should call only the original getter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;

        context.testObject.onGetterOfGetterAndSetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};
        context.testObject.getterAndSetterValue = value;

        // Act
        var actualValue = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(actualValue, value, 'Should get the value');
    });

    QUnit.test('verify - should verify only the no arguments function', 7, function (assert) {
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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, true, 'no arguments should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the one argument function', 7, function (assert) {
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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, true, 'one arguments should be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the many argument function', 7, function (assert) {
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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the getter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var value = context.testObject.getter;

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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, true, 'getter should be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the setter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.setter = arg1;

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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, true, 'setter should be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'Getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the getter of getter and setter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var value = context.testObject.getterAndSetter;

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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, true, 'getter of getter and setter should be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the setter of getter and setter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.getterAndSetter = arg1;

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
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, true, 'setter of getter and setter should be verified');
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

    QUnit.test('verify - getter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        });

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was not called should return true on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - getter - was called should return false on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - getter - was called should return true on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter - was called should return false on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was called twice should return true on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getter;
        var value2 = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter - was called twice should return false on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getter;
        var value2 = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was called twice should return false on 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getter;
        var value2 = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - setter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        });

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - setter - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - setter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - setter - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - setter - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - setter - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - setter - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - setter - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - setter - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - setter - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - setter - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - setter - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - setter - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - setter - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - getter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was not called should return true on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - getter&setter - getter - was called should return false on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - getter&setter - getter - was called should return true on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called should return false on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called twice should return true on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getterAndSetter;
        var value2 = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called twice should return false on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getterAndSetter;
        var value2 = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called twice should return false on 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getterAndSetter;
        var value2 = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - setter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        });

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - getter&setter - setter - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - getter&setter - setter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - getter&setter - setter - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - getter&setter - setter - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - getter&setter - setter - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - getter&setter - setter - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
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
        context.testObject.setter = argSet[0];
        context.testObject.getterAndSetter = argSet[0];
        context.testObject.getterAndSetter;
        context.testObject.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[2]);
        context.testObject.getterAndSetter;
        context.testObject.setter = argSet[2];
        context.testObject.getterAndSetter = argSet[2];
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.setter = argSet[0];
        context.testObject.getterAndSetter;
        context.testObject.getterAndSetter = argSet[0];
        context.testObject.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        context.testObject.getter;
        context.testObject.noArgumentsFunction();
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.setter = argSet[0];
        context.testObject.getterAndSetter = argSet[0];
        context.testObject.getter;
        context.testObject.noArgumentsFunction();
        context.testObject.getterAndSetter;
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        context.testObject.noArgumentsFunction();
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.getter;
        context.testObject.setter = argSet[1];
        context.testObject.oneArgumentsFunction(argSet[1]);
        context.testObject.getterAndSetter = argSet[1];
        context.testObject.getterAndSetter = argSet[2];
        context.testObject.getterAndSetter = argSet[2];
        context.testObject.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        context.testObject.getter;
        context.testObject.oneArgumentsFunction(argSet[2]);
        context.testObject.setter = argSet[2];
        context.testObject.setter = argSet[2];
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

        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }), true, 'getter should be verified');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0)), false, 'getter should not be verified for 0');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(1)), false, 'getter should not be verified for 1');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2)), false, 'getter should not be verified for 2');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(3)), false, 'getter should not be verified for 3');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(4)), true), 'getter should be verified for 4';
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(5)), false, 'getter should not be verified for 5');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(6)), false, 'getter should not be verified for 6');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }), true, 'setter should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }), true, 'setter should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }), true, 'setter should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[3];
        }), false, 'setter should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(0)), false, 'setter should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(1)), false, 'setter should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(2)), false, 'setter not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(3)), true, 'setter should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(4)), false, 'setter should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(0)), false, 'setter should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(1)), true, 'setter should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(2)), false, 'setter should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(3)), false, 'setter should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(0)), false, 'setter should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(1)), false, 'setter should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(2)), false, 'setter should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(3)), true, 'setter should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(4)), false, 'setter should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(5)), false, 'setter should not be verified for argSet[2] 5 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }), true, 'getterAndSetter getter should be verified');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0)), false, 'getterAndSetter getter should not be verified for 0');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(1)), false, 'getterAndSetter getter should not be verified for 1');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2)), false, 'getterAndSetter getter should not be verified for 2');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(3)), false, 'getterAndSetter getter should not be verified for 3');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(4)), true), 'getterAndSetter getter should be verified for 4';
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(5)), false, 'getterAndSetter getter should not be verified for 5');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(6)), false, 'getterAndSetter getter should not be verified for 6');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }), true, 'getterAndSetter setter should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }), true, 'getterAndSetter setter should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }), true, 'getterAndSetter setter should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[3];
        }), false, 'getterAndSetter setter should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(0)), false, 'getterAndSetter setter should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(1)), false, 'getterAndSetter setter should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(2)), false, 'getterAndSetter setter not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(3)), true, 'getterAndSetter setter should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(4)), false, 'getterAndSetter setter should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(0)), false, 'getterAndSetter setter should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(1)), true, 'getterAndSetter setter should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(2)), false, 'getterAndSetter setter should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(3)), false, 'getterAndSetter setter should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(0)), false, 'getterAndSetter setter should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(1)), false, 'getterAndSetter setter should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(2)), false, 'getterAndSetter setter should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(3)), true, 'getterAndSetter setter should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(4)), false, 'getterAndSetter setter should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(5)), false, 'getterAndSetter setter should not be verified for argSet[2] 5 times');
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

    QUnit.test('verify - setter - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.setter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = itIs;
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - setter - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.setter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = itIs;
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - getter&setter - setter - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.getterAndSetter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = itIs;
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - getter&setter - setter - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.getterAndSetter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = itIs;
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - after setups should count ok', function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
        });
        context.testObject.getter;
        context.testObject.getter;
        context.testObject.getter;
        context.testObject.getter;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).callback(function () {
        });
        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(2);
        }).callback(function () {
        });
        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(3);
        }).callback(function () {
        });
        context.testObject.oneArgumentsFunction(1);
        context.testObject.oneArgumentsFunction(2);
        context.testObject.oneArgumentsFunction(2);
        context.testObject.oneArgumentsFunction(3);
        context.testObject.oneArgumentsFunction(3);
        context.testObject.oneArgumentsFunction(3);
        context.testObject.oneArgumentsFunction(4);
        context.testObject.oneArgumentsFunction(4);
        context.testObject.oneArgumentsFunction(4);
        context.testObject.oneArgumentsFunction(4);

        // Assert
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(4)), true, 'should verify getter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(1);
        }, Times.exact(1)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(2);
        }, Times.exact(2)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(3);
        }, Times.exact(3)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(4);
        }, Times.exact(4)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }, Times.exact(10)), true, 'should verify calling with any number correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }, Times.exact(11)), false, 'should verify calling with any number correctly');
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

    QUnit.test('callBase - set to true after constructor should call the original getter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalGetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original getter should be called');
        };

        testObject.onGetterCalled = originalGetterWasCalled;

        // Act
        testObject.getter;
    });

    QUnit.test('callBase - set to true after constructor should call the original setter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalSetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original setter should be called');
        };

        testObject.onSetterCalled = originalSetterWasCalled;

        // Act
        testObject.setter = 1;
    });

    QUnit.test('callBase - set to true after constructor should call the original getter of getter and setter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalGetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original getter should be called');
        };

        testObject.onGetterOfGetterAndSetterCalled = originalGetterWasCalled;

        // Act
        testObject.getterAndSetter;
    });

    QUnit.test('callBase - set to true after constructor should call the original setter of getter and setter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalSetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original setter should be called');
        };

        testObject.onSetterOfGetterAndSetterCalled = originalSetterWasCalled;

        // Act
        testObject.getterAndSetter = 1;
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

    QUnit.test('callBase - set to false after constructor should not call the original getters and setters', 0, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var shouldNotCall = function () {
            // Assert
            assert.ok(false, 'should not be called');
        };

        testObject.onGetterCalled = shouldNotCall;
        testObject.onSetterCalled = shouldNotCall;
        testObject.onGetterOfGetterAndSetterCalled = shouldNotCall;
        testObject.onSetterOfGetterAndSetterCalled = shouldNotCall;

        // Act
        testObject.getter;
        testObject.setter = 1;
        testObject.getterAndSetter;
        testObject.getterAndSetter = 1;
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

    QUnit.test('callBase - set to true should return the original getter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var getterValue = {};
        testObject.getterValue = getterValue;

        // Act
        var result = testObject.getter;

        // Assert
        assert.strictEqual(result, getterValue, 'should return the correct value');
    });

    QUnit.test('callBase - set to true should set the setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var setterValue = {};

        // Act
        testObject.setter = setterValue;

        // Assert
        assert.strictEqual(testObject.setterValue, setterValue, 'should set the correct value');
    });

    QUnit.test('callBase - set to true should return the original getter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var getterAndSetterValue = {};
        testObject.getterAndSetterValue = getterAndSetterValue;

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, getterAndSetterValue, 'should return the correct value');
    });

    QUnit.test('callBase - set to true should set the setter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var getterAndSetterValue = {};

        // Act
        testObject.getterAndSetter = getterAndSetterValue;

        // Assert
        assert.strictEqual(testObject.getterAndSetterValue, getterAndSetterValue, 'should set the correct value');
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

    QUnit.test('callBase - set to false should not return the original getter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var getterValue = {};
        testObject.getterValue = getterValue;

        // Act
        var result = testObject.getter;

        // Assert
        assert.notStrictEqual(result, getterValue, 'should not return the value');
    });

    QUnit.test('callBase - set to false should not set the setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var setterValue = {};

        // Act
        testObject.setter = setterValue;

        // Assert
        assert.notStrictEqual(testObject.setterValue, setterValue, 'should not set the value');
    });

    QUnit.test('callBase - set to false should not return the original getter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var getterAndSetterValue = {};
        testObject.getterAndSetterValue = getterAndSetterValue;

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        assert.notStrictEqual(result, getterAndSetterValue, 'should not return the correct value');
    });

    QUnit.test('callBase - set to false should not set the setter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var getterAndSetterValue = {};

        // Act
        testObject.getterAndSetter = getterAndSetterValue;

        // Assert
        assert.notStrictEqual(testObject.getterAndSetterValue, getterAndSetterValue, 'should not set the value');
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

    QUnit.test('callBase - set to false should return undefined from getters', 2, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        testObject.getterValue = 1;
        testObject.getterAndSetterValue = 1;

        // Act
        var result1 = testObject.getter;
        var result2 = testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result1, undefined, 'should return undefined');
        assert.strictEqual(result2, undefined, 'should return undefined');
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

    QUnit.test('setup - callback - should not call callback if getter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if getter of getter and setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if setter of getter and setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
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

    QUnit.test('setup - callback - should call callback when getter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - callback - should call callback when setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should call callback when getter of getter and setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should call callback when setter of getter and setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getterAndSetter = 1;
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

    QUnit.test('setup - callback - should not call the original getter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
        });

        context.testObject.onGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - callback - should not call the original setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        context.testObject.onSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should not call the original getter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        context.testObject.onGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should not call the original setter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        context.testObject.onSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getterAndSetter = 1;
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

    QUnit.test('setup - callback - should pass the same parameters to setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.setter = It.isAny(Number);
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should call with same argument');
        });

        // Act
        context.testObject.setter = arg;
    });

    QUnit.test('setup - callback - should pass the same parameters to setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.getterAndSetter = It.isAny(Number);
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass the same argument');
        });

        // Act
        context.testObject.getterAndSetter = arg;
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
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call other original functions 2', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should not call other original functions 3', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.setter = 1;
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
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

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

    QUnit.test('setup - callback - should call all the callbacks when function is called for getter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
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
        context.testObject.getter;
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
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
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for getter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
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
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for setter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
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
        context.testObject.getterAndSetter = 1;
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

    QUnit.test('setup - callback - should not affect verify for getter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for setter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.setter = 1;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.getterAndSetter = 1;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - setting setter should not affect getter', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        var value = {};
        context.testObject.getterAndSetterValue = value;

        // Act
        var result = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, value, 'should return the correct value');
    });

    QUnit.test('setup - callback - setting getter should not affect setter', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        var value = {};

        // Act
        context.testObject.getterAndSetter = value;

        // Assert
        assert.strictEqual(context.testObject.getterAndSetterValue, value, 'should set the correct value');
    });

    QUnit.test('setup - callback - calling with not matching value should call the original function', 2, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).callback(function () {
        });

        var arg = {};
        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.ok(true, 'should call the original function');
            assert.strictEqual(_arg, arg, 'should call with the passed value');
        };

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - calling setter with not matching value should call the original setter', 2, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        var arg = {};
        context.testObject.onSetterCalled = function (_arg) {
            // Assert
            assert.ok(true, 'should call the original setter');
            assert.strictEqual(_arg, arg, 'should call with the passed value');
        };

        // Act
        context.testObject.setter = arg;
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

    QUnit.test('setup - returns - should not call the original getter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).returns(111);

        context.testObject.onGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - returns - should not call the original getter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).returns(111);

        context.testObject.onGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getterAndSetter;
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

    QUnit.test('setup - returns - should return the value for getter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.getter;
        }).returns(returnValue);

        // Act
        var result = context.testObject.getter;

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - returns - should return the value for getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).returns(returnValue);

        // Act
        var result = context.testObject.getterAndSetter;

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

    QUnit.test('setup - returns - setting getter should not affect setter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).returns(returnValue);

        var valueToSet = {};

        // Act
        context.testObject.getterAndSetter = valueToSet;

        // Assert
        assert.strictEqual(context.testObject.getterAndSetterValue, valueToSet, 'should set the configured value');
    });

    QUnit.test('setup - returns - calling with not matching argument should return the original', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(2);

        // Assert
        assert.notStrictEqual(result, returnValue, 'should not return the configured value');
    });

    QUnit.test('setup - returnsInOrder - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([111]);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([111]);

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

    QUnit.test('setup - returnsInOrder - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([111]);

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

    QUnit.test('setup - returnsInOrder - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns([111]);

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

    QUnit.test('setup - returnsInOrder - should return the values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returnsInOrder([returnValue1, returnValue2, returnValue3]);

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

    QUnit.test('setup - returnsInOrder - should return the last returns values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue1);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returnsInOrder([returnValue5, returnValue6, returnValue7]);

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

    QUnit.test('setup - returnsInOrder - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([4]);

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - returnsInOrder - should return the last returns values for getter', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        context.mole.setup(function (_) {
            return _.getter;
        }).returns(returnValue1);
        context.mole.setup(function (_) {
            return _.getter;
        }).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        context.mole.setup(function (_) {
            return _.getter;
        }).returnsInOrder([returnValue5, returnValue6, returnValue7]);

        // Act
        var result1 = context.testObject.getter;
        var result2 = context.testObject.getter;
        var result3 = context.testObject.getter;
        var result4 = context.testObject.getter;

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return undefined');
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

    QUnit.test('setup - lazyReturns - should return the last returnFunction return of getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setup(function (_) {
            return _.getterAndSetter;
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
        var result = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call returnFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
                // Assert
                assert.ok(false, 'should not call returnFunction');
            }]);
    });

    QUnit.test('setup - lazyReturnsInOrder - should call returnFunction when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        var functionThatWasCalled = [];
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([
            function () {
                return functionThatWasCalled.push(1);
            },
            function () {
                return functionThatWasCalled.push(2);
            },
            function () {
                return functionThatWasCalled.push(3);
            }]);

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

    QUnit.test('setup - lazyReturnsInOrder - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should pass the same parameters', 2, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturnsInOrder([
            function (_arg1) {
                // Assert
                assert.strictEqual(_arg1, arg1, 'should return same argument');
            }, function (_arg2) {
                // Assert
                assert.strictEqual(_arg2, arg2, 'should return same argument');
            }]);

        // Act
        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
    });

    QUnit.test('setup - lazyReturnsInOrder - should pass the same parameters 2', 6, function (assert) {
        // Arrange
        var context = this;

        var arg11 = 1;
        var arg12 = 2;
        var arg13 = 3;
        var arg21 = 4;
        var arg22 = 5;
        var arg23 = 6;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturnsInOrder([
            function (_arg11, _arg12, _arg13) {
                // Assert
                assert.strictEqual(_arg11, arg11, 'should return same argument');
                assert.strictEqual(_arg12, arg12, 'should return same argument');
                assert.strictEqual(_arg13, arg13, 'should return same argument');
            }, function (_arg21, _arg22, _arg23) {
                // Assert
                assert.strictEqual(_arg21, arg21, 'should return same argument');
                assert.strictEqual(_arg22, arg22, 'should return same argument');
                assert.strictEqual(_arg23, arg23, 'should return same argument');
            }]);

        // Act
        context.testObject.manyArgumentsFunction(arg11, arg12, arg13);
        context.testObject.manyArgumentsFunction(arg21, arg22, arg23);
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

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

    QUnit.test('setup - lazyReturnsInOrder - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

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

    QUnit.test('setup - lazyReturnsInOrder - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

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

    QUnit.test('setup - lazyReturnsInOrder - should return the returnFunction return values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturnsInOrder([
            function () {
                return returnValue1;
            },
            function () {
                return returnValue2;
            },
            function () {
                return returnValue3;
            }
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

    QUnit.test('setup - lazyReturnsInOrder - should return the last returnFunction return values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturnsInOrder([function () {
                return returnValue3;
            }, function () {
                return returnValue4;
            }]).lazyReturnsInOrder([function () {
                return returnValue5;
            }, function () {
                return returnValue6;
            }, function () {
                return returnValue7;
            }]);

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

    QUnit.test('setup - lazyReturnsInOrder - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
                return 4;
            }]);

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - lazyReturnsInOrder - should return the last returnFunction return values of getter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturnsInOrder([function () {
                return returnValue3;
            }, function () {
                return returnValue4;
            }]).lazyReturnsInOrder([function () {
                return returnValue5;
            }, function () {
                return returnValue6;
            }, function () {
                return returnValue7;
            }]);

        // Act
        var result1 = context.testObject.getterAndSetter;
        var result2 = context.testObject.getterAndSetter;
        var result3 = context.testObject.getterAndSetter;
        var result4 = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return the last returnValue');
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

    QUnit.test('setup - throws - should throw the last error for getter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getter;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getter;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.setter = 1;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter = 1;
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

    QUnit.test('setup - throws - setting getter should not affect setter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter = 1;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - setting setter should not affect getter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - calling setter with not matching argument should not throw', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).throws({});

        try  {
            context.testObject.setter = 2;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - calling setter of getter and setter with not matching argument should not throw', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).throws({});

        try  {
            context.testObject.getterAndSetter = 2;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - calling function with not matching argument should not throw', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).throws({});

        try  {
            context.testObject.oneArgumentsFunction(2);
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - lazyThrows - should not call returnErrorFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setup - lazyThrows - should call returnErrorFunction when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
        });

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyThrows(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        try  {
            context.testObject.oneArgumentsFunction(arg);
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should pass the same parameters 2', 3, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyThrows(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
            assert.strictEqual(_arg2, arg2, 'should return same argument');
            assert.strictEqual(_arg3, arg3, 'should return same argument');
        });

        try  {
            context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
        });

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

    QUnit.test('setup - lazyThrows - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
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

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call lazyThrows on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
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

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should throw the returnErrorFunction error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyThrows(function () {
            return error;
        });

        try  {
            context.testObject.returning1Function();
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error, 'should throw the error');
        }
    });

    QUnit.test('setup - lazyThrows - should throw the last returnErrorFunction error', 1, function (assert) {
        // Arrange
        var context = this;

        var error1 = {};
        var error2 = {};
        var error3 = {};
        var error4 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyThrows(function () {
            return error1;
        }).lazyThrows(function () {
            return error2;
        }).lazyThrows(function () {
            return error3;
        }).lazyThrows(function () {
            return error4;
        });

        try  {
            context.testObject.returning1Function();
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error4, 'should throw the last error');
        }
    });

    QUnit.test('setup - lazyThrows - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
            return 4;
        });

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

    QUnit.test('setup - mix - setup for one object should not affect other', 5, function (assert) {
        // Arrange
        var context = this;

        var testObject1 = new Tests.TestObject();
        var testObject2 = new Tests.TestObject();

        var mole1 = new Mole(testObject1);
        var mole2 = new Mole(testObject2);

        var arg1 = 10;
        var returnsValue = 1;
        mole1.setup(function (_) {
            return _.getter;
        }).returns(returnsValue);
        mole1.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg1, 'should call with correct argument');
        });

        var arg2 = 20;
        testObject2.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg2, 'should call with correct argument');
        };

        testObject1.onGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not be called');
        };

        testObject2.onGetterCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        var value = {};
        testObject2.getterValue = value;

        // Act
        var result1 = testObject1.getter;
        var result2 = testObject2.getter;
        testObject1.oneArgumentsFunction(arg1);
        testObject2.oneArgumentsFunction(arg2);

        // Assert
        assert.strictEqual(result1, returnsValue, 'should return the correct value');
        assert.strictEqual(result2, value, 'should return the correct value');
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

    QUnit.test('setupPrivate - callback - should not call callback if getter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if getter of geter&setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if setter of geter&setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
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

    QUnit.test('setupPrivate - callback - should call callback when getter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateGetter();
    });

    QUnit.test('setupPrivate - callback - should call callback when setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateSetter(1);
    });

    QUnit.test('setupPrivate - callback - should not call callback when setter is called with wrong parameter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });

        // Act
        context.testObject.callPrivateSetter(2);
    });

    QUnit.test('setupPrivate - callback - should call callback when getter of getter&setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateGetterOfGetterAndSetter();
    });

    QUnit.test('setupPrivate - callback - should call callback when setter of getter&setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(1);
    });

    QUnit.test('setupPrivate - callback - should not call callback when setter of getter&setter is called with wrong parameter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(2);
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

    QUnit.test('setupPrivate - callback - should not call the original getter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).callback(function () {
        });

        context.testObject.onPrivateGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateGetter();
    });

    QUnit.test('setupPrivate - callback - should not call the original setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateSetter(1);
    });

    QUnit.test('setupPrivate - callback - should call the original setter if called with other argument', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call the original setter');
        };

        // Act
        context.testObject.callPrivateSetter(2);
    });

    QUnit.test('setupPrivate - callback - should not call the original getter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
        });

        context.testObject.onPrivateGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateGetterOfGetterAndSetter();
    });

    QUnit.test('setupPrivate - callback - should not call the original setter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(1);
    });

    QUnit.test('setupPrivate - callback - should call the original setter of getter and setter if called with other argument', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call the original setter');
        };

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(2);
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

    QUnit.test('setupPrivate - callback - should pass the same parameters to setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 2;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 2).callback(function (_arg1) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateSetter(arg1);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters to setter of getter&setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 2;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 2).callback(function (_arg1) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(arg1);
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

    QUnit.test('setupPrivate - callback - should not call setter if not matching', 0, function (assert) {
        // Arrange
        var context = this;

        var arg = 'some text';

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, It.isAny(Number)).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateSetter(arg);
    });

    QUnit.test('setupPrivate - callback - should not call setter of getter&setter if not matching', 0, function (assert) {
        // Arrange
        var context = this;

        var arg = 'some text';

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number)).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(arg);
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

    QUnit.test('setupPrivate - callback - should pass the same parameters to all the callbacks when function is called', 4, function (assert) {
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

    QUnit.test('setupPrivate - returns - should return the last getter value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue1);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue2);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue3);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateGetter();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - returns - should return the last getter of getter and setter value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue1);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue2);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue3);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateGetterOfGetterAndSetter();

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

    QUnit.test('setupPrivate - lazyReturns - setup getter should not affect setter', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME).lazyReturns(function () {
            return 1;
        });

        var value = {};

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(value);

        // Assert
        assert.strictEqual(context.testObject.privateGetterAndSetterValue, value, 'should set the value');
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

    QUnit.test('setupPrivate - throws - should throw the error for getter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).throws(thrownError);

        try  {
            context.testObject.callPrivateGetter();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetter(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should not throw the error for setter if arguments dont match', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetter(2);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for getter of getter&setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        try  {
            context.testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for setter of getter&setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetterOfGetterAndSetter(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should not throw the error for setter of getter&setter if arguments dont match', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - setup getter should not throw on setter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        try  {
            context.testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - setup setter should not throw on getter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
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

    QUnit.test('setupPrivate - mix - if both setups match should call both for setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.callPrivateSetter(1);
    });

    QUnit.test('setupPrivate - mix - if both setups match should call both for setter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(1);
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

    QUnit.test('isStrict - true - no setup for getter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.getter;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for setter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.setter = 1;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for getter of getter and setter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.getterAndSetter;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for setter of getter and setter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.getterAndSetter = 1;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - has callback setup should call the callback and not throw error', 1, function (assert) {
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

    QUnit.test('isStrict - true - getter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.getter;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - setter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.setter = 1;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - getter of getter&setter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.getterAndSetter;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - setter of getter&setter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.getterAndSetter = 1;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has callback setup  for other argument should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).callback(function () {
        });

        try  {
            // Act
            context.testObject.oneArgumentsFunction(2);
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - setter has callback setup for other argument should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        try  {
            // Act
            context.testObject.setter = 2;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - setter of getter&setter has callback setup for other argument should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        try  {
            // Act
            context.testObject.getterAndSetter = 2;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
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

    QUnit.test('staticFunction - Override static function', 1, function (assert) {
        // Arrange
        var context = this;

        var mole = new Mole(Tests.TestObject);

        // Act
        mole.setup(function (_) {
            Tests.TestObject.staticFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        Tests.TestObject.staticFunction();
    });

    QUnit.test('setup - inheritence - callback on sons function should call callback', 1, function (assert) {
        // Arrange
        var context = this;

        var testObjectSon = new Tests.TestObjectSon();
        var mole = new Mole(testObjectSon);

        // Act
        mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'callbeck was called');
        });

        testObjectSon.noArgumentsFunction();
    });

    QUnit.test('dispose - before dispose should not call the original function', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('dispose - before dispose should not call the original getter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.getter;
    });

    QUnit.test('dispose - before dispose should not call the original setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.setter = 1;
    });

    QUnit.test('dispose - before dispose should not call the original getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterOfGetterAndSetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.getterAndSetter;
    });

    QUnit.test('dispose - before dispose should not call the original setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterOfGetterAndSetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.getterAndSetter = 1;
    });

    QUnit.test('dispose - should call the original function', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.noArgumentsFunction();
    });

    QUnit.test('dispose - should call the original getter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.getter;
    });

    QUnit.test('dispose - should call the original setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.setter = 1;
    });

    QUnit.test('dispose - should call the original getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.getterAndSetter;
    });

    QUnit.test('dispose - should call the original setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.getterAndSetter = 1;
    });

    QUnit.test('findMoleByObject - if null should return null', 1, function (assert) {
        // Act
        var result = Mole.findMoleByObject(null);

        // Assert
        assert.strictEqual(result, null, 'should return null');
    });

    QUnit.test('findMoleByObject - if undefined should return null', 1, function (assert) {
        // Act
        var result = Mole.findMoleByObject(undefined);

        // Assert
        assert.strictEqual(result, null, 'should return null');
    });

    QUnit.test('findMoleByObject - object without mole should return null', 1, function (assert) {
        // Act
        var result = Mole.findMoleByObject({});

        // Assert
        assert.strictEqual(result, null, 'should return null');
    });

    QUnit.test('findMoleByObject - object with mole should return the mole', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var result = Mole.findMoleByObject(context.testObject);

        // Assert
        assert.strictEqual(result, context.mole, 'should return correct mole');
    });

    QUnit.test('findMoleByObject - objects with moles should return correct moles', 3, function (assert) {
        // Arrange
        var context = this;

        var obj1 = {};
        var obj2 = {};

        var mole1 = new Mole(obj1);
        var mole2 = new Mole(obj2);

        // Act
        var result1 = Mole.findMoleByObject(obj1);
        var result2 = Mole.findMoleByObject(obj2);
        var result3 = Mole.findMoleByObject(context.testObject);

        // Assert
        assert.strictEqual(result1, mole1, 'should return correct mole');
        assert.strictEqual(result2, mole2, 'should return correct mole');
        assert.strictEqual(result3, context.mole, 'should return correct mole');
    });

    QUnit.test('findMoleByObject - after dispose on mole should not return the mole for the object', 4, function (assert) {
        // Arrange
        var context = this;

        var obj1 = {};
        var obj2 = {};
        var obj3 = {};

        var mole1 = new Mole(obj1);
        var mole2 = new Mole(obj2);

        // Act
        mole2.dispose();
        var mole3 = new Mole(obj3);
        var result1 = Mole.findMoleByObject(obj1);
        var result2 = Mole.findMoleByObject(obj2);
        var result3 = Mole.findMoleByObject(context.testObject);
        var result4 = Mole.findMoleByObject(obj3);

        // Assert
        assert.strictEqual(result1, mole1, 'should return correct mole');
        assert.strictEqual(result2, null, 'should return null after dispose');
        assert.strictEqual(result3, context.mole, 'should return correct mole');
        assert.strictEqual(result4, mole3, 'should return correct mole');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=MoleTest.js.map
