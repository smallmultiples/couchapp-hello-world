# Basic CouchApp

*Note: This document assumes you have npm and couchdb already installed.*

Install couchapp node module

	sudo npm install -g couchapp
	
Create a folder "attachments" and put a file "index.html" into it.

	mkdir attachments
	touch attachments/index.html
	vi attachments/index.html
	
Put anything in index.html

	<h1>Hola Mundo!</h1>

Create a sample app.js file

	touch app.js
	vi app.js
	
This is the very basic content of app.js

	 var couchapp = require('couchapp')
	  , path = require('path')
	  ;
	
	ddoc = 
	  { 
	    _id:'_design/app'
	  };
	
	couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));
	
	module.exports = ddoc;
	
Create a DB for your app:

	curl -X PUT http://localhost:5984/testapp
	{"ok":true}

Push your app:

	couchapp push app.js http://localhost:5984/testapp
	
Test your app:

	http://localhost:5984/testapp/_design/app/index.html
