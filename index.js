'use strict'

const postcss = require('postcss');

exports.fileWriter = require('./filewriter');

exports.default = postcss.plugin('postcss-reverse-props', (options = {}) => {
  	const result = new Set();
  
    return root => {
        root.walkRules(rule => {
        	(rule.selector.match(/\.[a-z0-9\-\_]+/gi) || []).forEach(cls => {
            	result.add(cls);
            })  	
        });
      	
      	this.fileWriter.toFile(result, options.output);
    };
});



