// Legislator methods
'use strict';

var geocoder = require('geocoder'),
  async = require('async'),
  cached = require('cached'),

  DependencyRequester = require('../requesters/legislator-dependencies'),

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

  findByAddress (address){
    var cacheKey = address;

    var cacheMiss = cached.deferred(function(done) {
      geocoder.geocode( address, function( err, data ){
        this.onGetCoordsForAddress( err, data, done );
      }.bind(this));
    }.bind(this));

    cache.getOrElse(cacheKey, cacheMiss).then(function(data){
      this.respond(data);
    }.bind(this));
  }

  onGetCoordsForAddress(err, data, done) {
    var coords = data.results[0].geometry.location,
      req = this.req;

    if (!data.results.length || err) {
      return done(null, {legislators:[]})
    }

    req.query.latitude = coords.lat;
    req.query.longitude = coords.lng;
    delete req.query.address;

    this.findByCoods(done);
  }

  findByCoods(done){
    var legislator = this.model,
      req = this.req;

    legislator.endpoint = 'legislators/locate';
    legislator.find(req.query, function( legislators ){
      this.getDependencies( legislators, function( resBody ){
        done(null, resBody)
      });

    }.bind(this));
  }

  respond(response){
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

  find() {
    var legislator = this.model,
      req = this.req,
      query = {bioGuideId: req.path.split('/')[3]}

    legislator.find(query, this.onFind.bind(this));
  }

  onFind(legislators){
    this.getDependencies( legislators, function( resBody ){
      this.respond(resBody);
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
    var dependencyRequester = new DependencyRequester();

    dependencyRequester.get(legislator, function(results){
      this.contributors = this.contributors.concat(results.contributors);
      this.industries = this.industries.concat(results.industries);
      this.bills = this.bills.concat(results.bills);
      callback()
    }.bind(this));
  }
}
