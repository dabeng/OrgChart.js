import chai from 'chai';
import OrgChart from '../lib/orgchart.js';

chai.expect();

const expect = chai.expect;

var lib;

describe('Given an instance of my library', function () {
  before(function () {
    lib = new OrgChart();
  });
  describe('when I need the name', function () {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('OrgChart');
    });
  });
});