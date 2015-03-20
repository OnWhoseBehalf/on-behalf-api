Model = require '../models/model'
config = require '../../config'

class Legislator extends Model
  constructor: ->
    @query = null
    @responseKey = 'legislators'
    @endpoint = 'legislators'
    @url = config.urls.congress

module.exports = Legislator
