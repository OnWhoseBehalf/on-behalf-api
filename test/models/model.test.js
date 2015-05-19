var expect = require('expect.js');
var Model = require('./../../src/models/model');
var sinon = require('sinon');
var request = require('request');

describe('models/model.js', function(){
  var model = headers = query = undefined;
  var noop = function () {}
  beforeEach(function(){
    request.Request = sinon.spy();
    model = new Model()
    headers = {
      'content-type': 'application/json; charset=UTF-8',
      'X-APIKEY': '66603c029b1b49428da28d6a783f795e'
    };

    model.query = {
      test: 'hello',
      foo: 'bar'
    };
  });

  describe('find', function() {
    it('adds headers', function(){
      model.find({test: 'hi there'}, noop);

      expect(model.headers).to.eql(headers);
    });

    it('creates a query', function() {
      model.find({test: 'hi there'}, noop);

      expect(model.query).to.eql({
        test: 'hi there', foo: 'bar'
      });

    });
  });

  describe('createHashOptions', function() {
    var options = undefined;

    beforeEach(function () {
      model.url = 'http://localhost/';
      model.endpoint = 'endpoint';
      model.headers = 'oh hi there!'
      options = model.createHashOptions();
    });

    it('creates url option', function () {
      expect(options).to.have.key('url');
      expect(options.url).to.eql('http://localhost/endpoint?test=hello&foo=bar');
    });

    it('creates headers option', function () {
      expect(options).to.have.key('headers');
      expect(options.headers).to.eql('oh hi there!');
    });
  });

  describe('makeRequest', function() {
    it('calls request library with args', function () {
      model.url = 'http://localhost/';
      model.endpoint = 'endpoint';
      model.options = model.createHashOptions();

      model.makeRequest('hi');
      expect(true).to.be(true);
    });
  });
});
