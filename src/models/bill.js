var Model = require('../models/model'),
  config = require('../../config');

// Constructor
function Bill(){
  this.query = {
    apikey: config.apiKey
  };
  this.endpoint = '/bills';
  this.url = config.urls.congress;
}

Bill.prototype = new Model();

Bill.prototype.findById = function(query, callback) {
  this.url += query.id;
  this.find(query, callback);
};

Bill.prototype.findByChamber = function(query, callback){

  if (query.chamber === 'senate') {
      query['history.senate_passage_result__exists'] = true;
  } else {
      query['history.house_passage_result__exists'] = true;
  }
  this.find( query, callback );
};

Bill.prototype.formatResponse = function(body) {
  var responseData = {};
  responseData = JSON.parse( body ).results;

  responseData = responseData.filter(function(item) {
    // `undefined != null` coerces undefined to null
    return item.bill_id != null;
  });

  return {bills: responseData};
};

module.exports = Bill;
