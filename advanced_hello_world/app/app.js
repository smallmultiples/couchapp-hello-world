var fs = require('fs')
var utils = require('../utils.js');

module.exports = {
	_id: "_design/jadeapp",
	views: {
		foo: {
			map: function(doc){ 
			  emit(doc._id, doc.title)
			}
		},
		none: {
        	map: function(doc) {}
      	}
	},
    lists: {
      	index: function(head, req) {
        	provides("html", function() {
	        	var ddoc = this
				var template = require('templates/compiled/index')

				var context = { "title": "Jade CouchDB"
					, "style": "font-style: italic; font-size: 115%"
					, "message": "This template was precompiled."
					};
				
				var result = template(context);				
				return result;
      		})
        },
        index2: function(head, req) {
        	provides("html", function() {
	        	var ddoc = this
				var jade = require('lib/jade_full')

				var context = { "title": "Jade CouchDB"
					, "style": "font-style: italic; font-size: 115%"
					, "message": "This template is compiled on the fly"
					};
				
				var template = ddoc.templates.raw.index;
				var result = jade.render(template, context);
				return result;
      		})
        }
    },
	shows: {
		hello: function(doc, req) {
			var result = 'Hello world';
			return { code: 200
					 , headers: {"Content-Type": "text/html"}
					 , body: result
					 }
			}
	},
	lib: {
		jade_runtime: fs.readFileSync(require.resolve('jade/lib/runtime.js'),"UTF8"),
		jade_full: 'var self=this;'+fs.readFileSync(__dirname+"/lib/jade.js","UTF8")
	}	
}