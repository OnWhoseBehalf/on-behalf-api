'use strict';

var Model = require('../models/model'),
  config = require('../../config');

class Industry extends Model {

  constructor() {
    super();
    this.query = {
      apikey: config.apiKey
    };
    this.endpoint = '/contributors/industries.json';
    this.url = config.urls.transparency + 'aggregates/pol/';
  }

  findById(query, callback) {
    this.url += query.id;
    this.find(query, callback);
  }

  formatResponse(body) {
    var parsedBody = JSON.parse( body ),

    results = parsedBody.filter(function(item){
      return item.id != null;
    });

    return {
      industries: results
    };

  }
}

module.exports = Industry;
