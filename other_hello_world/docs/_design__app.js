exports.doc = {
	"_id": "_design/app",
	"views": {
		"foo": {
			"map": function(doc){ 
				emit(doc._id, doc.title)
			}
		}
	},
	"shows": {
		"test": function(doc, req) {
			return { 
				body : '<h1>' + doc.title + '</h1>',
				headers : {'Content-Type' : 'text/html','X-My-Own-Header': 'you can set your own headers'}
			}
		}
	}
}