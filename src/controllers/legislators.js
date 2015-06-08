// Legislator methods
'use strict';

var geocoder = require('geocoder'),
  request = require('request'),
  querystring = require('querystring'),
  async = require('async'),
  cached = require('cached'),

  LegislatorController = require('./legislator'),

  LegislatorModel = require('../models/legislator'),
  ContributorModel = require('../models/contributor'),
  IndustryModel = require('../models/industry'),
  EntityModel = require('../models/entity');

var cache = cached('zip-map', { backend: {
  type: 'memcached',
  hosts: '127.0.0.1:11211',
}});

module.exports = class Legislators {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.model = new LegislatorModel();
    this.contributors = [];
    this.industries = [];
    this.bills = [];
  }

  get() {
    var query = this.req.query;

    if ( query.address ){
      this.findByAddress( query.address );
    } else {
      this.find({}, function( legislators ){
        _this.getDependencies( legislators, function( resBody ){
          _this.respond( resBody );
        });
      });
    }
  }

  findByCoods(done){
    var legislator = this.model,
      req = this.req;

    legislator.endpoint = 'legislators/locate';

    legislator.find({
      latitude: req.query.latitude,
      longitude: req.query.longitude
    }, function( legislators ){
      this.getDependencies( legislators, function( resBody ){
        done(null, resBody)
      });

    }.bind(this));
  }

  findByAddress (address){
    var _this = this,
    cacheKey = address;

    var cacheMiss = cached.deferred(function(done) {
      geocoder.geocode( address, function( err, data ){
        if (!data.results.length) {
          var responseData = { legislators:[] };

          done(null, responseData)
        } else {
          _this.onGetCoordsForAddress( err, data, done );
        }
      });
    });

    cache.getOrElse(cacheKey, cacheMiss).then(function(data){
      _this.respond(data);
    });
  }

  onGetCoordsForAddress(err, data, done) {

    var coords = data.results[0].geometry.location,
      req = this.req;

    req.query.latitude = coords.lat;
    req.query.longitude = coords.lng;
    delete req.query.address;

    this.findByCoods(done);
  }

  respond(response){

    var res = this.res,
      domain = 'http://localhost:4200';

    if(process.env.PRODUCTION){
      domain = 'http://www.onwhosebehalf.com'
    }

    res.setHeader('Access-Control-Allow-Origin', domain);
    res.json(response);
  }

  find() {
    var legislator = this.model,
      req = this.req,
      bioGuideId = req.path.split('/')[3];

    legislator.find({
      bioguide_id: bioGuideId
    }, this.onFind.bind(this));
  }

  onFind(legislators){
    this.getDependencies( legislators, function( resBody ){
      this.respond( resBody );
    }.bind(this));
  }

  getDependencies(responseData, callback) {
    var legislators = responseData.legislators,
      getLegislatorDependencies = this.getLegislatorDependencies.bind(this);

    async.map(legislators, getLegislatorDependencies, function(err, results){
      responseData.contributors = this.contributors;
      responseData.industries = this.industries;
      responseData.bills = this.bills;
      callback(responseData);
    }.bind(this));
  }

  getLegislatorDependencies(legislator, callback) {
    var legislatorController = new LegislatorController();

    legislatorController.getDependencies(legislator, function(results){
      this.contributors = this.contributors.concat(results.contributors);
      this.industries = this.industries.concat(results.industries);
      this.bills = this.bills.concat(results.bills);
      callback()
    }.bind(this));
  }
}
