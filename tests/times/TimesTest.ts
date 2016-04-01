import { expect } from 'chai';
import { ITimes } from '../../src/times/ITimes';
import { Times } from '../../src/times/Times';

describe('Times', () => {

  describe('lessThan', () => {

    it('on smaller should return true', () => {
      // Arrange
      var times: ITimes = Times.lessThan(4);

      // Act
      var result: boolean = times.match(1);

      // Assert
      expect(result).to.be.true;
    });

    it('on bigger should return false', () => {
      // Arrange
      var times: ITimes = Times.lessThan(4);

      // Act
      var result: boolean = times.match(5);

      // Assert
      expect(result).to.be.false;
    });

    it('on same should return false', () => {
      // Arrange
      var times: ITimes = Times.lessThan(4);

      // Act
      var result: boolean = times.match(4);

      // Assert
      expect(result).to.be.false;
    });

  });

  describe('atMost', () => {

    it('on smaller should return true', () => {
      // Arrange
      var times: ITimes = Times.atMost(4);

      // Act
      var result: boolean = times.match(1);

      // Assert
      expect(result).to.be.true;
    });

    it('on bigger should return false', () => {
      // Arrange
      var times: ITimes = Times.atMost(4);

      // Act
      var result: boolean = times.match(5);

      // Assert
      expect(result).to.be.false;
    });

    it('on same should return true', () => {
      // Arrange
      var times: ITimes = Times.atMost(4);

      // Act
      var result: boolean = times.match(4);

      // Assert
      expect(result).to.be.true;
    });

  });

  describe('exact', () => {

    it('on smaller should return false', () => {
      // Arrange
      var times: ITimes = Times.exact(4);

      // Act
      var result: boolean = times.match(1);

      // Assert
      expect(result).to.be.false;
    });

    it('on bigger should return false', () => {
      // Arrange
      var times: ITimes = Times.exact(4);

      // Act
      var result: boolean = times.match(5);

      // Assert
      expect(result).to.be.false;
    });

    it('on same should return true', () => {
      // Arrange
      var times: ITimes = Times.exact(4);

      // Act
      var result: boolean = times.match(4);

      // Assert
      expect(result).to.be.true;
    });

  });

  describe('atLeast', () => {

    it('on smaller should return false', () => {
      // Arrange
      var times: ITimes = Times.atLeast(4);

      // Act
      var result: boolean = times.match(1);

      // Assert
      expect(result).to.be.false;
    });

    it('on bigger should return true', () => {
      // Arrange
      var times: ITimes = Times.atLeast(4);

      // Act
      var result: boolean = times.match(5);

      // Assert
      expect(result).to.be.true;
    });

    it('on same should return false', () => {
      // Arrange
      var times: ITimes = Times.atLeast(4);

      // Act
      var result: boolean = times.match(4);

      // Assert
      expect(result).to.be.true;
    });

  });

  describe('moreThan', () => {

    it('on smaller should return false', () => {
      // Arrange
      var times: ITimes = Times.moreThan(4);

      // Act
      var result: boolean = times.match(1);

      // Assert
      expect(result).to.be.false;
    });

    it('on bigger should return true', () => {
      // Arrange
      var times: ITimes = Times.moreThan(4);

      // Act
      var result: boolean = times.match(5);

      // Assert
      expect(result).to.be.true;
    });

    it('on same should return false', () => {
      // Arrange
      var times: ITimes = Times.moreThan(4);

      // Act
      var result: boolean = times.match(4);

      // Assert
      expect(result).to.be.false;
    });

  });

  describe('between', () => {

    it('on smaller should return false', () => {
      // Arrange
      var times: ITimes = Times.between(4, 7);

      // Act
      var result: boolean = times.match(1);

      // Assert
      expect(result).to.be.false;
    });

    it('on bigger should return false', () => {
      // Arrange
      var times: ITimes = Times.between(4, 7);

      // Act
      var result: boolean = times.match(8);

      // Assert
      expect(result).to.be.false;
    });

    it('when between should return true', () => {
      // Arrange
      var times: ITimes = Times.between(4, 7);

      // Act
      var result: boolean = times.match(5);

      // Assert
      expect(result).to.be.true;
    });

    it('when between on lower should return true', () => {
      // Arrange
      var times: ITimes = Times.between(4, 7);

      // Act
      var result: boolean = times.match(4);

      // Assert
      expect(result).to.be.true;
    });

    it('when between on higher should return true', () => {
      // Arrange
      var times: ITimes = Times.between(4, 7);

      // Act
      var result: boolean = times.match(7);

      // Assert
      expect(result).to.be.true;
    });

  });

});
