'use strict'

const fs = require('fs-extra');
const path = require('path');
const toFormat = require('number-to-first-letter');

module.exports = {

	toFile(set, pathToFile){
		pathToFile = (pathToFile || path.join(process.cwd(), 'postcss.tmpl', 'extracted-bemclasses.json'));

		fs.ensureFileSync(pathToFile);
		fs.writeFileSync(pathToFile, JSON.stringify(this.toObject(set)));
	},

	toObject(set){
		const result = {};
		let counter = 0;

		for(let item of set){
			result[item] = toFormat(counter);
			counter++
		}

		return result
	}

}

