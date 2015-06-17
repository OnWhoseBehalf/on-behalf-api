var expect = require('expect.js');
var Legislators = require('./../../src/controllers/legislators');
var sinon = require('sinon');
var request = require('request');

describe('controllers/legislators.js', function(){
  beforeEach(function(){
    var Legislators;
  });

  it('initializes with correct values');

  describe('#get', function(){
    describe('with address', function(){
      it('checks cache for zipcode')
      it('fetches lat/lng for zipcode with geocode')
    });

    describe('with bioguid_id', function(){
      it('fetches single legislator')
    });
  });
});
