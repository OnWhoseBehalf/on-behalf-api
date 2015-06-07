var express = require('express'),
	geocoder = require('geocoder'),
	request = require('request'),
	http = require('http'),
	querystring = require('querystring');

var Legislators = 	require('./controllers/legislators');

exports.define = function(app){

	app.get('/api/legislator*', function(req, res){
		var legislator = new Legislators( req, res );
		legislator.get();
	});
};
