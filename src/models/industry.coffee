Model = require '../models/model'
config = require '../../config'

# aggregates/org/c7e4389a20b547a498653319e1036ffe/recipients.json?limit=10&apikey=66603c029b1b49428da28d6a783f795e

class Industry extends Model
  constructor: ->
    @query = apikey: config.apiKey
    @endpoint = '/contributors/industries.json'
    @url = config.urls.transparency + 'aggregates/pol/'

  findById: (query, callback) ->
    @url += query.id
    @find query, callback

  formatResponse: (body) ->
    parsedBody = JSON.parse body
    results = parsedBody.filter (item) ->
      item.id != null

    { industries: results }

module.exports = Industry
