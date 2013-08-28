 var couchapp = require('couchapp')
  , path = require('path')
  , fs = require('fs')
  ;

var doc = require('./docs/_design__app');
module.exports = doc.doc;