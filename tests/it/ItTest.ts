import { expect } from 'chai';
import { ItIsBase } from '../../src/it/ItIsBase';
import { It }from '../../src/it/It';

describe('It', () => {
  class Parent {
  }

  class Son extends Parent {
  }

  describe('isAny', () => {

    it('expect number check number should return true', () => {
      // Arrange
      var expectedType: Function = Number;
      var actual = 1;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect number check string should return false', () => {
      // Arrange
      var expectedType: Function = Number;
      var actual = '';

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect string check number should return false', () => {
      // Arrange
      var expectedType: Function = String;
      var actual = 1;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect string check empty string should return true', () => {
      // Arrange
      var expectedType: Function = String;
      var actual = '';

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect string check string should return true', () => {
      // Arrange
      var expectedType: Function = String;
      var actual = 'some text';

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect string check null should return false', () => {
      // Arrange
      var expectedType: Function = String;
      var actual = null;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect string check undefined should return false', () => {
      // Arrange
      var expectedType: Function = String;
      var actual = undefined;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect number check null should return false', () => {
      // Arrange
      var expectedType: Function = Number;
      var actual = null;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect number check undefined should return false', () => {
      // Arrange
      var expectedType: Function = Number;
      var actual = undefined;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect parent check son should return true', () => {
      // Arrange
      var expectedType: Function = Parent;
      var actual = new Son();

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect parent check parent should return true', () => {
      // Arrange
      var expectedType: Function = Parent;
      var actual = new Parent();

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect son check parent should return false', () => {
      // Arrange
      var expectedType: Function = Son;
      var actual = new Parent();

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect son check son should return true', () => {
      // Arrange
      var expectedType: Function = Son;
      var actual = new Son();

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect son check null should return false', () => {
      // Arrange
      var expectedType: Function = Son;
      var actual = null;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect son check undefined should return false', () => {
      // Arrange
      var expectedType: Function = Son;
      var actual = undefined;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect number check [] should return false', () => {
      // Arrange
      var expectedType: Function = Number;
      var actual = [];

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect number check Array should return false', () => {
      // Arrange
      var expectedType: Function = Number;
      var actual = new Array();

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect array check number should return false', () => {
      // Arrange
      var expectedType: Function = Array;
      var actual = 1;

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.false;
    });

    it('expect array check [] should return true', () => {
      // Arrange
      var expectedType: Function = Array;
      var actual = [];

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect array check array should return true', () => {
      // Arrange
      var expectedType: Function = Array;
      var actual = new Array();

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect array check not empty [] should return true', () => {
      // Arrange
      var expectedType: Function = Array;
      var actual = [1, '', {}];

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

    it('expect array check not empty array should return true', () => {
      // Arrange
      var expectedType: Function = Array;
      var actual = new Array(1, '', {});

      var isAny: ItIsBase = It.isAny(expectedType);

      // Act
      var result = isAny.match(actual);

      // Assert
      expect(result).to.be.true;
    });

  });

  describe('is', () => {

    it('should call the function passed with the argument', () => {
      // Arrange
      var arg = {};

      var actualArg;
      var itIs: ItIsBase = It.is(_arg => {
        actualArg = _arg;
        return true;
      });

      // Act
      itIs.match(arg);

      // Assert
      expect(actualArg).to.be.equal(arg);
    });

    it('function returns true should return true', () => {
      // Arrange
      var arg = {};

      var itIs: ItIsBase = It.is(_arg => {
        return true;
      });

      // Act
      var result = itIs.match(arg);

      // Assert
      expect(result).to.be.true;
    });

    it('function returns false should return false', () => {
      // Arrange
      var arg = {};

      var itIs: ItIsBase = It.is(_arg => {
        return false;
      });

      // Act
      var result = itIs.match(arg);

      // Assert
      expect(result).to.be.false;
    });

  });

  describe('isInRange', () => {

    it('not a number should return false', () => {
      // Arrange
      var arg = {};

      var itIs: ItIsBase = It.isInRange(1, 2);

      // Act
      var result = itIs.match(arg);

      // Assert
      expect(result).to.be.false;
    });

    it('min range number should return true', () => {
      // Arrange
      var min = 1;
      var max = 3;

      var itIs: ItIsBase = It.isInRange(min, max);

      // Act
      var result = itIs.match(min);

      // Assert
      expect(result).to.be.true;
    });

    it('max range number should return true', () => {
      // Arrange
      var min = 1;
      var max = 3;

      var itIs: ItIsBase = It.isInRange(min, max);

      // Act
      var result = itIs.match(max);

      // Assert
      expect(result).to.be.true;
    });

    it('middle number should return true', () => {
      // Arrange
      var min = 1;
      var middle = 2;
      var max = 3;

      var itIs: ItIsBase = It.isInRange(min, max);

      // Act
      var result = itIs.match(middle);

      // Assert
      expect(result).to.be.true;
    });

  });

  describe('isRegExp', () => {

    it('isRegExp - not string should return false', () => {
      // Arrange
      var itIs: ItIsBase = It.isRegExp(new RegExp('[1-8]'));

      // Act
      var result = itIs.match(1);

      // Assert
      expect(result).to.be.false;
    });

    it('isRegExp - not string should return false 2', () => {
      // Arrange
      var itIs: ItIsBase = It.isRegExp(new RegExp('[1-8]'));

      // Act
      var result = itIs.match({});

      // Assert
      expect(result).to.be.false;
    });

    it('isRegExp - not matching should return false', () => {
      // Arrange
      var itIs: ItIsBase = It.isRegExp(new RegExp('[1-8]'));

      // Act
      var result = itIs.match('9');

      // Assert
      expect(result).to.be.false;
    });

    it('isRegExp - matching should return true', () => {
      // Arrange
      var itIs: ItIsBase = It.isRegExp(new RegExp('[1-8]'));

      // Act
      var result = itIs.match('8');

      // Assert
      expect(result).to.be.true;
    });

  });

});
