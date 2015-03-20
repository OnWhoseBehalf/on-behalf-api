Model = require '../models/model'
config = require '../../config'
# Constructor

class Contributor extends Model
  constructor: ->
    @query = apikey: config.apiKey
    @endpoint = '/contributors.json'
    @url = config.urls.transparency + 'aggregates/pol/'

  findById: (query, callback) ->
    @url += query.id
    @find query, callback

formatResponse: (body) ->
    parsedBody = JSON.parse body
    results = parsedBody.filter (item) ->
      item.id != null

    { contributors: results }

module.exports = Contributor
