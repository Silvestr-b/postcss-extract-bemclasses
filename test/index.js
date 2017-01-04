'use strict'

const postcss = require('postcss');
const expect = require('chai').expect;
const sinon = require('sinon');
const pm = require('../index.js');
const plugin = pm.default;
const pathToFile = 'path/to/file.json';
const options = {output: pathToFile};
const selfToFile = pm.fileWriter.toFile;
let toFile; 


describe('postcss-extract-bemclasses', () => {
	
	before(() => {
		pm.fileWriter.toFile = a => a;
		toFile = sinon.spy(pm.fileWriter, 'toFile');
	});

	describe('Должен корректно работать: ', () => {

		it('Если класс один', () => {
			return run(patterns().alone, toFile, options);
		})
		
		it('Если классы перечислены через пробелы', () => {
			return run(patterns().spaceBeetween, toFile, options);
		})
		
		it('Если классы перечислены без пробелов', () => {
			return run(patterns().withoutSpaceBeetween, toFile, options);
		})
		
		it('Если между селектором и скобкой нет пробела', () => {
			return run(patterns().withoutSpaceBeforeBracket, toFile, options);
		})
		
		it('Если есть другие селекторы (#, a)', () => {
			return run(patterns().withOtherSelectors, toFile, options);
		})
		
	})

	it('Псевдоклассы и псевдоселекторы не попадают в список, но класс к которым они применяются попадает', () => {
		return run(patterns().pseudo, toFile, options);
	})

	after(() => {
		pm.fileWriter.toFile = selfToFile;	
	})

})








function patterns(){
	return {
		alone: { 
			css: '.button {}',
			set: ['.button']
		},
		spaceBeetween: { 
			css: '.button .icon .elem {}',
			set: ['.button', '.icon', '.elem']
		},
		withoutSpaceBeetween: {
			css: '.button.icon.elem {}',
			set: ['.button', '.icon', '.elem']
		},
		withoutSpaceBeforeBracket: { 
			css: '.button{}',
			set: ['.button']
		},
		withOtherSelectors: { 
			css: 'tag#id.button {} tag {} #id {}',
			set: ['.button']
		},
		pseudo: {
			css: '.button:hover .icon .elem:after {}',
			set: ['.button', '.icon', '.elem']
		}
	}
} 

function toFormat(code){
	return code.replace(/[\s\t\n]+/gi, '')
}

function run(pattern, toFile, options){
	return  _run(pattern.css, pattern.css, options).then(() => {
		const set = toFile.args[0][0];
		const path = toFile.args[0][1];

		for(let cls of pattern.set){
			expect(set.has(cls)).to.be.true;
		}
		for(let cls of set){
			expect(pattern.set.indexOf(cls) !== -1).to.be.true;
		}
		expect(path).to.be.equal(pathToFile);

		toFile.reset()
	})
}

function _run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(toFormat(result.css)).to.equal(toFormat(output));
            expect(result.warnings().length).to.equal(0);
        });
}