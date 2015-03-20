request = require 'request'
queryString = require 'querystring'
merge = require 'merge'

class Model
  headers:
    'content-type': 'application/json; charset=UTF-8'
    'X-APIKEY': '66603c029b1b49428da28d6a783f795e'

  constructor: ->
    @query = null
    @responseKey = null
    @endpoint = nullcd
    @url = null

  find: (query, callback) ->
    @query = merge(@query, query)
    @options = createHashOptions.call(this)
    makeRequest.call this, callback

  formatResponse: (body) ->
    responseData = {}
    responseData[@responseKey] = JSON.parse(body).results
    responseData

createHashOptions = ->
  query = queryString.stringify(@query)
  options =
    url: @url + @endpoint
    method: 'GET'
    headers: @headers
  if query
    options.url = options.url + '?' + query
  options

makeRequest = (callback) ->
  _this = this
  options = @options
  request options, (error, response, body) ->
    responseData = undefined
    if !error and response.statusCode == 200
      responseData = _this.formatResponse(body)
      callback responseData

module.exports = Model
