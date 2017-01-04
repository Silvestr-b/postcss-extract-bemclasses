'use strict'

const expect = require('chai').expect;
const fs = require('fs-extra');
const path = require('path');
const writer = require('../filewriter.js');


describe('fileWriter', () => {

	describe('toFile', () => {
		const pathWithDirname = path.join(__dirname, 'postcss.root', 'selectors.json');
		const pathWithCwd = path.join(process.cwd(), 'postcss.tmpl', 'extracted-bemclasses.json');

		afterEach(() => {
			fs.removeSync(path.parse(pathWithDirname).dir);
			fs.removeSync(path.parse(pathWithCwd).dir);
		})

		it('Если путь к файлу передан, то должен создать файл с json-ом по данному пути', () => {
			writer.toFile(getSet(2), pathWithDirname);

			expect(fs.existsSync(pathWithDirname)).to.be.true;
			expect(JSON.parse(fs.readFileSync(pathWithDirname))).to.be.eql({s0: 'a', s1: 'b'})
		})

		it('Если путь не передан, то должен создать файл process.cwd()/postcss.tmpl/extracted-bemclasses.json', () => {
			writer.toFile(getSet(2));

			expect(fs.existsSync(pathWithCwd)).to.be.true;
			expect(JSON.parse(fs.readFileSync(pathWithCwd))).to.be.eql({s0: 'a', s1: 'b'});
		})

	})

	describe('toObject', () => {
		
		it('Если передан пустой сет должен вернуть пустой объект', () => {
			expect(writer.toObject(getSet(0))).to.be.eql({});
		})

		it('Если сет не пустой должен вернуть объект где свойства это элементы сета а значения отформатированное число', () => {
			expect(writer.toObject(getSet(1))).to.be.eql({s0: 'a'});
			expect(writer.toObject(getSet(2))).to.be.eql({s0: 'a', s1: 'b'});
		})

		it('Количество свойств объекта равно количеству елементов сета', () => {
			const set = getSet(10000);
			const obj = writer.toObject(set);

			expect(set.size).to.be.eql(Object.keys(obj).length);
		})

		it('Ключи в объекте уникальны', () => {
			const obj = writer.toObject(getSet(10000));
			const keysSet = new Set(Object.keys(obj));

			expect(keysSet.size).to.be.eql(10000);
		})

		it('Значения в объекте уникальны', () => {
			const obj = writer.toObject(getSet(10000));
			const valsSet = new Set();

			for(let key in obj){
				valsSet.add(obj[key])
			}

			expect(valsSet.size).to.be.eql(10000)
		})

	})


	describe('toFormat', () => {
		
		it('Если передано число 0-9, то должен возвращать соотвестствующую букву', () => {
			expect(writer.toFormat(0)).to.be.equal('a');
			expect(writer.toFormat(1)).to.be.equal('b');
			expect(writer.toFormat(9)).to.be.equal('j');
		})

		it('Если передано число больше, то должен возвращать букву соотвестствующую первой цифре числа + остальную часть числа переведенную в 36-ричную систему', () => {
			expect(writer.toFormat(12)).to.be.equal('b2');
			expect(writer.toFormat(456)).to.be.equal('e1k');
			expect(writer.toFormat(7864)).to.be.equal('ho0');
		})

		it('Если вторая цифра в числе - 0, то возвращает "_" + число в 36-ричной системе', () => {
			expect(writer.toFormat(10)).to.be.equal('_a');
			expect(writer.toFormat(400)).to.be.equal('_b4');
			expect(writer.toFormat(6000)).to.be.equal('_4mo');
		})

		it('Все значения уникальны', () => {
			const set = new Set();

			for(let i = 0; i < 10000; i++){
				set.add(writer.toFormat(i))
			}

			expect(set.size).to.be.equal(10000);
		})

	})

})




function getSet(num){
	const set = new Set();

	for(let i = 0; i < num; i++){
		set.add('s' + i);
	}

	return set
}