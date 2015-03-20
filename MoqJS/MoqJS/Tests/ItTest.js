'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tests;
(function (Tests) {
    var It = moqJS.It;

    var Parent = (function () {
        function Parent() {
        }
        return Parent;
    })();

    var Son = (function (_super) {
        __extends(Son, _super);
        function Son() {
            _super.apply(this, arguments);
        }
        return Son;
    })(Parent);

    var ItIsLyfecycleObject = (function () {
        function ItIsLyfecycleObject() {
            this.beforeEach = function () {
                var context = this;
            };
            this.afterEach = function () {
            };
        }
        return ItIsLyfecycleObject;
    })();

    QUnit.module('It', new ItIsLyfecycleObject());

    QUnit.test('isAny - expect number check number should return true', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = 1;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect number check string should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = '';

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check number should return false', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = 1;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check empty string should return true', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = '';

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect string check string should return true', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = 'some text';

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect string check null should return false', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = null;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check undefined should return false', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = undefined;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check null should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = null;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check undefined should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = undefined;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect parent check son should return true', 1, function (assert) {
        // Arrange
        var expectedType = Parent;
        var actual = new Son();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect parent check parent should return true', 1, function (assert) {
        // Arrange
        var expectedType = Parent;
        var actual = new Parent();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect son check parent should return false', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = new Parent();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect son check son should return true', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = new Son();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect son check null should return false', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = null;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect son check undefined should return false', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = undefined;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check [] should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = [];

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check Array should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = new Array();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect array check number should return false', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = 1;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect array check [] should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = [];

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check array should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = new Array();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check not empty [] should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = [1, '', {}];

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check not empty array should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = new Array(1, '', {});

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=ItTest.js.map
