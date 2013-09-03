 var couchapp = require('couchapp')
  , path = require('path')
  , fs = require('fs')
  , utils = require('./utils.js')
  ;

var app = require('./app/app.js');
app.templates = {
	raw: couchapp.loadFiles('./app/templates'),
	compiled: couchapp.loadFiles('./app/templates', {
		operators: [
            utils.modulariseTemplate
        ]
	})
}

module.exports = app;