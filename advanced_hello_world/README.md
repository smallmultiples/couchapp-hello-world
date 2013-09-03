# More Advanced CouchApp

This example shows the use of Jade templating engine, both with precompiled templates and raw templates.

	sudo npm install -g couchapp
	install couchapp
	npm install jade
	couchapp push app.js http://admin:password@localhost:5984/jadeapp
	
Note: don't know why, I had to install couchapp both globaly and localy…
also, create the DB jadeapp using futon if it's not there.

Try:

<http://127.0.0.1:5984/jadeapp/_design/jadeapp/_list/index2/none>
<http://127.0.0.1:5984/jadeapp/_design/jadeapp/_list/index/none>