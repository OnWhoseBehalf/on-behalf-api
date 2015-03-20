express = require 'express'
geocoder = require 'geocoder'
request = require 'request'
http = require 'http'
querystring = require 'querystring'
Legislator = require './controllers/legislator'

exports.define = (app) ->
  app.get '/api/legislator*', (req, res) ->
    legislator = new Legislator req, res
    legislator.get()
    # Wildcard
    # app.get('/*', function(req, res) {
    #   console.log(req.path + ' requested');
    #   res.sendfile(req.path.substr(1));
    # });
