var expect = require('expect.js');
var Dependencies = require('./../../src/requesters/legislator-dependencies');
var sinon = require('sinon');
var request = require('request');

describe('requesters/legislator-dependencies.js', function(){
  beforeEach(function(){
    var Dependencies;
  });

  describe('fetches entity', function(){
    it('passes bioguide_id')
    it('adds entity id to legislator')
  });

  describe('fetches contributors', function(){
    it('passes entity')
    it('passes limit')
    it('adds unique id onto contributor')
    it('adds contributor ids to legislator')
  });

  describe('fetches industries', function(){
    it('passes entity')
    it('passes limit')
    it('adds unique id onto industry')
    it('adds industry ids to legislator')
  });

  describe('fetches bills', function(){
    it('passes chamber')
    it('sets id property on bills')
    it('adds bill ids to legislator')
  });
});
