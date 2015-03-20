'use strict';

module Tests {
    import ItIsBase = moqJS.ItIsBase;
    import It = moqJS.It;

    class Parent {
    }

    class Son extends Parent {
    }

    class ItIsLyfecycleObject implements LifecycleObject {
        public beforeEach = function () {
            var context: ItIsLyfecycleObject = this;
        };

        public afterEach = function () {
        };
    }

    QUnit.module('It', new ItIsLyfecycleObject());

    QUnit.test('isAny - expect number check number should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Number;
        var actual = 1;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect number check string should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Number;
        var actual = '';

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check number should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = String;
        var actual = 1;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check empty string should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = String;
        var actual = '';

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect string check string should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = String;
        var actual = 'some text';

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect string check null should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = String;
        var actual = null;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check undefined should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = String;
        var actual = undefined;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check null should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Number;
        var actual = null;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check undefined should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Number;
        var actual = undefined;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect parent check son should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Parent;
        var actual = new Son();

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect parent check parent should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Parent;
        var actual = new Parent();

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect son check parent should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Son;
        var actual = new Parent();

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect son check son should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Son;
        var actual = new Son();

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect son check null should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Son;
        var actual = null;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect son check undefined should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Son;
        var actual = undefined;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check [] should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Number;
        var actual = [];

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check Array should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Number;
        var actual = new Array();

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect array check number should return false', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Array;
        var actual = 1;

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect array check [] should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Array;
        var actual = [];

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check array should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Array;
        var actual = new Array();

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check not empty [] should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Array;
        var actual = [1, '', {}];

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check not empty array should return true', 1, function (assert: QUnitAssert) {
        // Arrange
        var expectedType: Function = Array;
        var actual = new Array(1, '', {});

        var isAny: ItIsBase = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });
} 