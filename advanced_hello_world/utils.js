exports.modulariseTemplate = function(template) {
	var jade = require('jade')
	var test = jade.compile(template,{client:true,compileDebug:false,filename:template});
	return "var jade = require('lib/jade_runtime'); module.exports=" + test;
}

exports.modulariseTemplateFile = function(filename) {
	var fs = require('fs')
	var template = fs.readFileSync(template,"UTF8");
	return exports.modulariseTemplate(template);
}
