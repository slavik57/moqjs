"use strict";
var chai_1 = require('chai');
var Times_1 = require('../../src/times/Times');
describe('Times', function () {
    describe('lessThan', function () {
        it('on smaller should return true', function () {
            var times = Times_1.Times.lessThan(4);
            var result = times.match(1);
            chai_1.expect(result).to.be.true;
        });
        it('on bigger should return false', function () {
            var times = Times_1.Times.lessThan(4);
            var result = times.match(5);
            chai_1.expect(result).to.be.false;
        });
        it('on same should return false', function () {
            var times = Times_1.Times.lessThan(4);
            var result = times.match(4);
            chai_1.expect(result).to.be.false;
        });
    });
    describe('atMost', function () {
        it('on smaller should return true', function () {
            var times = Times_1.Times.atMost(4);
            var result = times.match(1);
            chai_1.expect(result).to.be.true;
        });
        it('on bigger should return false', function () {
            var times = Times_1.Times.atMost(4);
            var result = times.match(5);
            chai_1.expect(result).to.be.false;
        });
        it('on same should return true', function () {
            var times = Times_1.Times.atMost(4);
            var result = times.match(4);
            chai_1.expect(result).to.be.true;
        });
    });
    describe('exact', function () {
        it('on smaller should return false', function () {
            var times = Times_1.Times.exact(4);
            var result = times.match(1);
            chai_1.expect(result).to.be.false;
        });
        it('on bigger should return false', function () {
            var times = Times_1.Times.exact(4);
            var result = times.match(5);
            chai_1.expect(result).to.be.false;
        });
        it('on same should return true', function () {
            var times = Times_1.Times.exact(4);
            var result = times.match(4);
            chai_1.expect(result).to.be.true;
        });
    });
    describe('atLeast', function () {
        it('on smaller should return false', function () {
            var times = Times_1.Times.atLeast(4);
            var result = times.match(1);
            chai_1.expect(result).to.be.false;
        });
        it('on bigger should return true', function () {
            var times = Times_1.Times.atLeast(4);
            var result = times.match(5);
            chai_1.expect(result).to.be.true;
        });
        it('on same should return false', function () {
            var times = Times_1.Times.atLeast(4);
            var result = times.match(4);
            chai_1.expect(result).to.be.true;
        });
    });
    describe('moreThan', function () {
        it('on smaller should return false', function () {
            var times = Times_1.Times.moreThan(4);
            var result = times.match(1);
            chai_1.expect(result).to.be.false;
        });
        it('on bigger should return true', function () {
            var times = Times_1.Times.moreThan(4);
            var result = times.match(5);
            chai_1.expect(result).to.be.true;
        });
        it('on same should return false', function () {
            var times = Times_1.Times.moreThan(4);
            var result = times.match(4);
            chai_1.expect(result).to.be.false;
        });
    });
    describe('between', function () {
        it('on smaller should return false', function () {
            var times = Times_1.Times.between(4, 7);
            var result = times.match(1);
            chai_1.expect(result).to.be.false;
        });
        it('on bigger should return false', function () {
            var times = Times_1.Times.between(4, 7);
            var result = times.match(8);
            chai_1.expect(result).to.be.false;
        });
        it('when between should return true', function () {
            var times = Times_1.Times.between(4, 7);
            var result = times.match(5);
            chai_1.expect(result).to.be.true;
        });
        it('when between on lower should return true', function () {
            var times = Times_1.Times.between(4, 7);
            var result = times.match(4);
            chai_1.expect(result).to.be.true;
        });
        it('when between on higher should return true', function () {
            var times = Times_1.Times.between(4, 7);
            var result = times.match(7);
            chai_1.expect(result).to.be.true;
        });
    });
});
