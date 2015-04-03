var express = require('express'),
	geocoder = require('geocoder'),
	request = require('request'),
	http = require('http'),
	querystring = require('querystring');

var Legislator = 	require('./controllers/legislator');

exports.define = function(app){

	app.get('/api/legislator*', function(req, res){
		var legislator = new Legislator( req, res );
		legislator.get();
	});
};
