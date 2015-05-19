'use strict';

var Model = require('../models/model'),
  config = require('../../config');

class Legislator extends Model {

  constructor() {
    super();
    this.query = null;
    this.responseKey = 'legislators';
    this.endpoint = 'legislators';
    this.url = config.urls.congress;
  }
}

module.exports = Legislator;
