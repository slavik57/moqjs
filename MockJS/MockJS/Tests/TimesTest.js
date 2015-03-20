'use strict';
var Tests;
(function (Tests) {
    var Times = mockJS.Times;

    var TimesLyfecycleObject = (function () {
        function TimesLyfecycleObject() {
            this.beforeEach = function () {
                var context = this;
            };
            this.afterEach = function () {
            };
        }
        return TimesLyfecycleObject;
    })();

    QUnit.module('Times', new TimesLyfecycleObject());

    QUnit.test('lessThan - on smaller should return true', 1, function (assert) {
        // Arrange
        var times = Times.lessThan(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, true, 'lessThan should return true when the actual is smaller');
    });

    QUnit.test('lessThan - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.lessThan(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, false, 'lessThan should return false when the actual is bigger');
    });

    QUnit.test('lessThan - on same should return false', 1, function (assert) {
        // Arrange
        var times = Times.lessThan(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, false, 'lessThan should return false when the actual is same');
    });

    QUnit.test('atMost - on smaller should return true', 1, function (assert) {
        // Arrange
        var times = Times.atMost(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, true, 'atMost should return true when the actual is smaller');
    });

    QUnit.test('atMost - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.atMost(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, false, 'atMost should return false when the actual is bigger');
    });

    QUnit.test('atMost - on same should return true', 1, function (assert) {
        // Arrange
        var times = Times.atMost(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'atMost should return true when the actual is same');
    });

    QUnit.test('exact - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.exact(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'exact should return false when the actual is smaller');
    });

    QUnit.test('exact - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.exact(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, false, 'exact should return false when the actual is bigger');
    });

    QUnit.test('exact - on same should return true', 1, function (assert) {
        // Arrange
        var times = Times.exact(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'exact should return true when the actual is same');
    });

    QUnit.test('atLeast - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.atLeast(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'atLeast should return false when the actual is smaller');
    });

    QUnit.test('atLeast - on bigger should return true', 1, function (assert) {
        // Arrange
        var times = Times.atLeast(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, true, 'atLeast should return true when the actual is bigger');
    });

    QUnit.test('atLeast - on same should return false', 1, function (assert) {
        // Arrange
        var times = Times.atLeast(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'atLeast should return true when the actual is same');
    });

    QUnit.test('moreThan - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.moreThan(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'moreThan should return false when the actual is smaller');
    });

    QUnit.test('moreThan - on bigger should return true', 1, function (assert) {
        // Arrange
        var times = Times.moreThan(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, true, 'moreThan should return true when the actual is bigger');
    });

    QUnit.test('moreThan - on same should return false', 1, function (assert) {
        // Arrange
        var times = Times.moreThan(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, false, 'moreThan should return false when the actual is same');
    });

    QUnit.test('between - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'between should return false when the actual is smaller');
    });

    QUnit.test('between - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(8);

        assert.strictEqual(result, false, 'between should return false when the actual is bigger');
    });

    QUnit.test('between - when between should return true', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, true, 'between should return true when the actual is between');
    });

    QUnit.test('between - when between on lower should return true', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'between should return true when the actual is between on lower');
    });

    QUnit.test('between - when between on higher should return true', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(7);

        assert.strictEqual(result, true, 'between should return true when the actual is between on higher');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=TimesTest.js.map
