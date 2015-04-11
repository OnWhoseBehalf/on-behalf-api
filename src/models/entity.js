'use strict';

var Model = require('../models/model'),
  config = require('../../config');

class Entity extends Model{
  
  constructor() {
    this.query = {
      apikey: config.apiKey
    };
    this.endpoint = 'entities/id_lookup.json';
    this.url = config.urls.transparency;
  }

  findId(query, callback) {
    this.find(query, callback);
  }

  formatResponse(body) {
    if (body) {
      return JSON.parse(body)[0].id;
    }
  }
  
}

module.exports = Entity;
