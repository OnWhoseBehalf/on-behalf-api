// Legislator methods
'use strict';

var sunlightApi = require("sunlight-congress-api"),
  config = require('../../config');

sunlightApi.init(config.apiKey);

module.exports = class Legislators {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  get() {
    sunlightApi.bills()
      .filter('history.senate_passage_result__exists', true)
      .filter('history.house_passage_result__exists', true)
      .call(function(data){
        // add ids here
        this.respond(null, {bills: data.results})
      }.bind(this));
  }

  respond(err, response){
    var res = this.res;
    res.setHeader('Access-Control-Allow-Origin', this.getDomain());
    res.json(response);
  }

  getDomain(){
    if(process.env.PRODUCTION){
      return 'http://www.onwhosebehalf.com';
    } else {
      return 'http://localhost:4200';
    }
  }
}
