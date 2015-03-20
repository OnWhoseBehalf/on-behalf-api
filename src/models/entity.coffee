Model = require '../models/model'
config = require '../../config'

class Entity extends Model
  constructor: ->
    @query = apikey: config.apiKey
    @endpoint = 'entities/id_lookup.json'
    @url = config.urls.transparency

  findId: (query, callback) ->
    @find query, callback

  formatResponse: (body) ->
    if body
      return JSON.parse(body)[0].id

module.exports = Entity
