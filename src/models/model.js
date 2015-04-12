'use strict';

var request = require('request'),
  queryString = require('querystring'),
  merge = require('merge'),
  config = require('../../config');

class Model {

  constructor() {
    this.query = null;
    this.responseKey = null;
    this.endpoint = null;
    this.url = null;
  }

  find(query, callback) {
    this.headers = {
      'content-type': 'application/json; charset=UTF-8',
      'X-APIKEY': config.apiKey
    };
    this.query = merge(this.query, query);
    this.options = this.createHashOptions.call(this);
    this.makeRequest.call(this, callback);
  }

  createHashOptions() {
    var query = queryString.stringify(this.query),
    options = {
      url: this.url + this.endpoint,
      method: 'GET',
      headers: this.headers
    };


    if ( query ) {
      options.url = options.url  + '?' + query;
    }

    return options;
  }

  makeRequest(callback) {

    var _this = this,
    options = this.options;

    request(options, function (error, response, body) {
      var responseData;

      if (!error && response.statusCode === 200) {
        responseData = _this.formatResponse( body );
        callback( responseData );
      }
    });

  }

  formatResponse(body) {
    var responseData = {};
    responseData[ this.responseKey ] = JSON.parse( body ).results;
    return responseData;
  }

}

module.exports = Model;
