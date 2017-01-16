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

})




function getSet(num){
	const set = new Set();

	for(let i = 0; i < num; i++){
		set.add('s' + i);
	}

	return set
}