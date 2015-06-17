'use strict';

var Model = require('../models/model'),
  config = require('../../config');

class Bill extends Model {
  constructor() {
    super();
    this.query = {
      apikey: config.apiKey
    };
    this.endpoint = 'bills';
    this.url = config.urls.congress;
  }

  findById (query, callback) {
    this.url += query.id;
    this.find(query, callback);
  }

  findByChamber(query, callback) {

    if (query.chamber === 'senate') {
      query['history.senate_passage_result__exists'] = true;
    } else {
      query['history.house_passage_result__exists'] = true;
    }

    this.find(query, callback);
  }

  formatResponse(body) {
    var responseData = {};
    responseData = JSON.parse( body ).results;
    return {bills: responseData};
  }

}

module.exports = Bill;
