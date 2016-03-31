"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chai_1 = require('chai');
var It_1 = require('../../src/it/It');
describe('It', function () {
    var Parent = (function () {
        function Parent() {
        }
        return Parent;
    }());
    var Son = (function (_super) {
        __extends(Son, _super);
        function Son() {
            _super.apply(this, arguments);
        }
        return Son;
    }(Parent));
    describe('isAny', function () {
        it('expect number check number should return true', function () {
            var expectedType = Number;
            var actual = 1;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect number check string should return false', function () {
            var expectedType = Number;
            var actual = '';
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect string check number should return false', function () {
            var expectedType = String;
            var actual = 1;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect string check empty string should return true', function () {
            var expectedType = String;
            var actual = '';
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect string check string should return true', function () {
            var expectedType = String;
            var actual = 'some text';
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect string check null should return false', function () {
            var expectedType = String;
            var actual = null;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect string check undefined should return false', function () {
            var expectedType = String;
            var actual = undefined;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect number check null should return false', function () {
            var expectedType = Number;
            var actual = null;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect number check undefined should return false', function () {
            var expectedType = Number;
            var actual = undefined;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect parent check son should return true', function () {
            var expectedType = Parent;
            var actual = new Son();
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect parent check parent should return true', function () {
            var expectedType = Parent;
            var actual = new Parent();
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect son check parent should return false', function () {
            var expectedType = Son;
            var actual = new Parent();
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect son check son should return true', function () {
            var expectedType = Son;
            var actual = new Son();
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect son check null should return false', function () {
            var expectedType = Son;
            var actual = null;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect son check undefined should return false', function () {
            var expectedType = Son;
            var actual = undefined;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect number check [] should return false', function () {
            var expectedType = Number;
            var actual = [];
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect number check Array should return false', function () {
            var expectedType = Number;
            var actual = new Array();
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect array check number should return false', function () {
            var expectedType = Array;
            var actual = 1;
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.false;
        });
        it('expect array check [] should return true', function () {
            var expectedType = Array;
            var actual = [];
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect array check array should return true', function () {
            var expectedType = Array;
            var actual = new Array();
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect array check not empty [] should return true', function () {
            var expectedType = Array;
            var actual = [1, '', {}];
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
        it('expect array check not empty array should return true', function () {
            var expectedType = Array;
            var actual = new Array(1, '', {});
            var isAny = It_1.It.isAny(expectedType);
            var result = isAny.match(actual);
            chai_1.expect(result).to.be.true;
        });
    });
    describe('is', function () {
        it('should call the function passed with the argument', function () {
            var arg = {};
            var actualArg;
            var itIs = It_1.It.is(function (_arg) {
                actualArg = _arg;
                return true;
            });
            itIs.match(arg);
            chai_1.expect(actualArg).to.be.equal(arg);
        });
        it('function returns true should return true', function () {
            var arg = {};
            var itIs = It_1.It.is(function (_arg) {
                return true;
            });
            var result = itIs.match(arg);
            chai_1.expect(result).to.be.true;
        });
        it('function returns false should return false', function () {
            var arg = {};
            var itIs = It_1.It.is(function (_arg) {
                return false;
            });
            var result = itIs.match(arg);
            chai_1.expect(result).to.be.false;
        });
    });
    describe('isInRange', function () {
        it('not a number should return false', function () {
            var arg = {};
            var itIs = It_1.It.isInRange(1, 2);
            var result = itIs.match(arg);
            chai_1.expect(result).to.be.false;
        });
        it('min range number should return true', function () {
            var min = 1;
            var max = 3;
            var itIs = It_1.It.isInRange(min, max);
            var result = itIs.match(min);
            chai_1.expect(result).to.be.true;
        });
        it('max range number should return true', function () {
            var min = 1;
            var max = 3;
            var itIs = It_1.It.isInRange(min, max);
            var result = itIs.match(max);
            chai_1.expect(result).to.be.true;
        });
        it('middle number should return true', function () {
            var min = 1;
            var middle = 2;
            var max = 3;
            var itIs = It_1.It.isInRange(min, max);
            var result = itIs.match(middle);
            chai_1.expect(result).to.be.true;
        });
    });
    describe('isRegExp', function () {
        it('isRegExp - not string should return false', function () {
            var itIs = It_1.It.isRegExp(new RegExp('[1-8]'));
            var result = itIs.match(1);
            chai_1.expect(result).to.be.false;
        });
        it('isRegExp - not string should return false 2', function () {
            var itIs = It_1.It.isRegExp(new RegExp('[1-8]'));
            var result = itIs.match({});
            chai_1.expect(result).to.be.false;
        });
        it('isRegExp - not matching should return false', function () {
            var itIs = It_1.It.isRegExp(new RegExp('[1-8]'));
            var result = itIs.match('9');
            chai_1.expect(result).to.be.false;
        });
        it('isRegExp - matching should return true', function () {
            var itIs = It_1.It.isRegExp(new RegExp('[1-8]'));
            var result = itIs.match('8');
            chai_1.expect(result).to.be.true;
        });
    });
});
