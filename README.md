# CouchApp Basics

CouchApps are applications written on top of CouchDB. In order to understand a CouchApp you first need to understand CouchDB. We'll asume you know what a document based db is in general, specialy CouchDB, so we'll jump directly to how it can be used to write full apps.

## Basic concepts

####Design documents 

Design documents are a special type of CouchDB document that contain application code. A design document is a CouchDB document with an id that begins with _design/. EG: \_design/myapp

Design documents also have some special fields that perform specific tasks:

**_attachments** This is an array of actual physical files. Any file in the _attachments array can be accessed directly via _design/myapp/filename.ext 

**views** Views are functions applied to ALL documents in your database. They define different transformations that can be applied to the documents before they are returned to the browser. Views can have 2 functions: **map** and **reduce**.

Eg:

	"views":
	  {
	    "all": {
	      "map": "function(doc) { if (doc.Type == 'customer')  emit(null, doc) }"
	    },
	    "by_lastname": {
	      "map": "function(doc) { if (doc.Type == 'customer')  emit(doc.LastName, doc) }"
	    },
	    "total_purchases": {
	      "map": "function(doc) { if (doc.Type == 'purchase')  emit(doc.Customer, doc.Amount) }",
	      "reduce": "function(keys, values) { return sum(values) }"
	    }
	  }

Views can then be accessed through the url:

<http://localhost:5984/testapp/_design/app/_view/foo>

Views can also accept the following parameters in the url:

* **key** will match the key used in the emit function on the view.
	Note that this key is not necesarily unique. Also don't forget the double quotes!
	EG: <http://localhost:5984/testapp/_design/app/_view/foo?key="aa">
	
* The **startkey** and **endkey** parameters specify an inclusive range on which we can search.

* To retrieve view results in reverse order, use the **descending=true** query parameter. If you are using a startkey parameter, you need to switch it to an endkey!

* Advanced parameters: **grouplevel** combined with reduce (will produce a reduce,re-reduce effect)


**validate_doc_update** This function gets executed for each document you want to create or update. If the validation function raises an exception, the update is denied; when it doesn’t, the updates are accepted.

Eg:

	"validate_doc_update": "function (newDoc, oldDoc, userCtx) {   
  		if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    		throw "Only admin can delete documents on this database.";
  		}"" 

**shows** 

	"shows": {
		"as_xml": "function(doc, req) {
		  return {
		    body : '<foo>' + doc.title + '</foo>',
		    headers : {
		      "Content-Type" : "application/xml",
		      "X-My-Own-Header": "you can set your own headers"
		    }
		  }"
		}
	}
	
<http://localhost:5984/testapp/_design/app/_show/as_xml/8a2326d3269884fb7b773544d50d0a7f>

### Tools

You don't really need any special tools to develop a CouchApp, however there are a few tools that will make your life easier. We'll only concentrate on the Node JS based tools.

* **CouchDB Javascript Api** CouchDB talks native Javascript. It's engine uses Mozilla SeaMonkey, with a few additional functions: <http://docs.couchdb.org/en/latest/query-servers.html>

* **couchapp** <https://npmjs.org/package/couchapp>  
Node.js utilities for building CouchDB applications.

* **kanso** <http://kan.so/>  
Kanso can be described as the NPM for CouchApps, with tools for installing and publishing shared packages while managing dependencies. 


### Virtual Hosts

CouchDB has also internal support for URL Rewrites, through the _rewrite property. Here are some tips on making it work on a dev environment.

Edit your /etc/hosts

	127.0.0.0.1	kleks.example.local
	127.0.0.0.1	www.example.local
	
Add this entry to your couchdb configuration using Futon [http://127.0.0.1:5984/_utils/config.html](http://127.0.0.1:5984/_utils/config.html):

	section = vhosts
	option = kleks.example.local 
	value = /kleks/_design/admin/_rewrite

Note: The next step was done for me after I did the above one, but it's worth checking just in case.

Edit **etc/couchdb/couchdb.ini** (in Mac OS under "~/Library/Application Support/CouchDB"), for example:

	vhosts:
  	kleks.example.local = /kleks/_design/admin/_rewrite"
  	www.example.local   = /kleks/_design/site/_rewrite/render/www.example.com
  	
You can now access your app by visiting: 

[http://kleks.example.com:5984/](http://kleks.couch:5984/)

Optional, if you're using apache you can set up a virtual host like this:

	<VirtualHost kleks.couch>
	   DocumentRoot "/Path/to/kleks"
	   ServerName kleks.couch
	   <Directory "/Path/to/kleks">
	        Options Indexes FollowSymLinks
	        AllowOverride All
	        Order allow,deny
	        Allow from all  
	    </Directory>
	</VirtualHost>
	
And then add a .htaccess with these lines:

	RewriteEngine On
	RewriteRule ^(.*)$ http://kleks.couch:5984/$1 [L,P]
	
Now you can access your CouchApp from port 80 without messing around with CouchDB's default port!

### Users
To add a user to couchdb, add the a record to the _users databse

	{
	    "_id": "org.couchdb.user:admin",
	    "name": "admin",
	    "type": "user",
	    "roles": ['manager'],
	    "password": "password"
	}

CouchDB will hash & salt the password for you on the server side and save the values in the fields password_sha and salt

### Terms:
Design Document = "Controller"

* Views = Custom queries/transformations on documents
* Shows = Show actions

### Links:

* <http://docs.couchdb.org/en/latest/>
* <http://guide.couchdb.org/draft/> (some parts seem outdated)
* <http://wiki.apache.org/couchdb/>
* <http://railsware.com/blog/2012/03/12/couchdb-and-couchapp-part-1/>
* <https://npmjs.org/package/couchapp>
* <http://kan.so/> 
* <https://github.com/markuso/kleks> A CMS written using Kanso