# Legislator methods
geocoder = require 'geocoder'
request = require 'request'
querystring = require 'querystring'
async = require 'async'
cached = require 'cached'

LegislatorModel = require '../models/legislator'
ContributorModel = require '../models/contributor'
IndustryModel = require '../models/industry'
EntityModel = require '../models/entity'
cache = cached 'zip-map',
  backend:
    type: 'memcached'
    hosts: '127.0.0.1:11211'

class Legislator
  constructor: (req, res) ->
    @req = req
    @res = res
    @model = new LegislatorModel
    @contributors = []
    @industries = []

  get: ->
    query = @req.query
    if query.address
      @findByAddress query.address
    else
      @find {}, (legislators) =>
        @getDependencies legislators, (resBody) =>
          @respond resBody


  findByCoods: (done) ->
    legislator = @model
    req = @req
    legislator.endpoint = 'legislators/locate'

    legislator.find {
      latitude: req.query.latitude
      longitude: req.query.longitude
    }, (legislators) =>
      @getDependencies legislators, (resBody) ->
        done null, resBody

  findByAddress: (address) ->
    cacheKey = address

    cacheMiss = cached.deferred (done) =>
      geocoder.geocode address, (err, data={}) =>
        if not data.results.length
          responseData = legislators: []
          @done null, responseData
          return
        @onGetCoordsForAddress err, data, done

    cache.getOrElse(cacheKey, cacheMiss).then (data) =>
      @respond data

  onGetCoordsForAddress: (err, data, done) ->
    coords = data.results[0].geometry.location
    req = @req
    req.query.latitude = coords.lat
    req.query.longitude = coords.lng

    delete req.query.address
    @findByCoods done

  respond: (response) ->
    res = @res
    domain = 'http://localhost:4200'
    if process.env.PRODUCTION
      domain = 'http://www.onwhosebehalf.com'
      console.log domain
    res.setHeader 'Access-Control-Allow-Origin', domain
    res.send JSON.stringify(response)

  find: ->
    legislator = @model
    req = @req
    bioGuideId = req.path.split('/')[3]

    legislator.find { bioguide_id: bioGuideId }, (legislators) =>
      @getDependencies legislators, (resBody) =>
        @respond resBody

  getDependencies: (responseData, callback) ->
    queries = []

    responseData.legislators.map (legislator) =>
      legislator.contributors = []
      legislator.industries = []
      queries.push (onFinish) =>
        async.auto {
          getEntity: (callback) =>
            @getEntityId legislator, callback
          getContributors: [
            'getEntity'
            (callback) =>
              @getContributors legislator, callback
          ]
          getIndustries: [
            'getEntity'
            (callback) =>
              @getIndustries legislator, callback
          ]
        }, (err, results) =>
          onFinish()

    async.parallel queries, =>
      responseData.contributors = @contributors
      responseData.industries = @industries
      callback responseData, callback

  getEntityId: (legislator, callback) ->
    entity = new EntityModel
    entity.findId { bioguide_id: legislator.bioguide_id }, (entityId) ->
      legislator.entityId = entityId
      callback()

  getContributors: (legislator, callback) ->
    contributor = new ContributorModel

    contributor.findById {
      id: legislator.entityId
      limit: 15
    }, (response) =>
      @contributors = @contributors.concat response.contributors

      response.contributors?.map (item) ->
        # combine ids to make it unique
        item.id += legislator.entityId
        legislator.contributors.push item.id

      callback()

  getIndustries: (legislator, callback) ->
    industry = new IndustryModel

    industry.findById {
      id: legislator.entityId
      cycle: 2012
      limit: 15
    }, (response) =>
      @industries = @industries.concat response.industries

      response.industries.map (item) ->
        item.id += legislator.entityId
        legislator.industries.push item.id

      callback()

module.exports = Legislator
