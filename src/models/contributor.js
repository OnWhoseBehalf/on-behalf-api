'use strict';

var Model = require('../models/model'),
  config = require('../../config');

class Contributor extends Model {

  constructor() {
    super();
    this.query = {
      apikey: config.apiKey
    };
    this.endpoint = '/contributors.json';
    this.url = config.urls.transparency + 'aggregates/pol/';
  }

  findById(query, callback) {
    this.url += query.id;
    this.find(query, callback);
  }

  formatResponse(body) {
    var parsedBody = JSON.parse( body ),
    results = parsedBody.filter(function(item){
      // `undefined != null` coerces undefined to null
      return item.id != null;
    });

    return {
      contributors: results
    };
  }

}

module.exports = Contributor;
