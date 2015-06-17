'use strict';

var async = require('async'),
  EntityModel = require('../models/entity'),
  IndustryModel = require('../models/industry'),
  ContributorModel = require('../models/contributor'),
  BillModel = require('../models/bill');

module.exports = class LegislatorDependencies {

  get(legislator, callback){
    this.legislator = legislator;
    this.legislator.contributors = [];
    this.legislator.industries = [];
    this.legislator.bills = [];

    async.auto({
      entityId: this.getEntityId.bind(this),
      contributors: ['entityId', this.getContributors.bind(this)],
      industries: ['entityId', this.getIndustries.bind(this)],
      bills: ['entityId', this.getVotedBills.bind(this)]
    }, function(err, results) {
      callback(results);
    });
  }

  getEntityId(callback){
    var entity = new EntityModel();

    entity.findId({
      bioguide_id: this.legislator.bioguide_id
    }, function(entityId){
      this.legislator.entityId = entityId
      callback(null, entityId);

    }.bind(this));
  }

  getContributors(callback) {
    var contributor = new ContributorModel(),
      _this = this;

    contributor.findById({
      id: this.legislator.entityId,
      limit: 15
    }, function( response ){

      var contributors = response.contributors;

      contributors.map( function( item ){
        item.id += _this.legislator.entityId;
        _this.legislator.contributors.push( item.id );
      });

      callback(null, contributors);
    });
  }

  getIndustries(callback) {

    var industry = new IndustryModel(),
      _this = this;

    industry.findById({
      id: this.legislator.entityId,
      limit: 15
    }, function( response ){

      var industries = response.industries;

      industries.map( function( item ){
        item.id += _this.legislator.entityId;
        _this.legislator.industries.push( item.id );
      });

      callback(null, industries);
    });
  }

  getVotedBills(callback) {
    var bill = new BillModel(),
      _this = this;

    bill.findByChamber({
      chamber: this.legislator.chamber,
    }, function(response) {

      response.bills.map(function(item) {
        item.id = item.bill_id
        _this.legislator.bills.push(item.bill_id);
      });

      callback(null, response.bills);
    });
  };
}
