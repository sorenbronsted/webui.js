const collect = require('collect.js');
const assert = require('assert');
const numeral = require('numeral');
const locales = require('numeral/locales');
const Formatter = require('../../lib/src/ui/Formatter.js').Formatter;

describe('Formatter tests', function() {

	let formatter;

	beforeEach(function() {
		formatter = new Formatter();
	});

	it("Should convert to a integer", function() {
		numeral.locale('da-dk');
		let fixtures = collect([
			[1, '1'],
			[1122, '1.122'],
			[1222333, '1.222.333']
		]);
		fixtures.each(row => {
			let source = row[0];
			let result = row[1];
			let test = formatter.display('number', source, '0,0');
			assert.equal(test, result);
			test = formatter.internal('number', test, '0,0');
			assert.equal(test, source);
		});
	});

	it("Should convert to a decimal", function() {
		numeral.locale('da-dk');
		let fixtures = new Map ([
			[1.2,'1,20'],
			[1120.23,'1.120,23'],
		]);
		for(let [source, result] of fixtures) {
			var test = formatter.display('number', source, '0,0.00');
			assert.equal(test, result);
			test = formatter.internal('number', test, '0,0.00');
			assert.equal(test, source);
		}
	});

	it("Should convert to a case number", function() {
		let fixtures = new Map ([
			[19980101,'19980101'],
			[19980101,'101/1998'],
		]);
		for(let [source, result] of fixtures) {
			var test = formatter.display('casenumber', source);
			assert.equal(test, result);
			test = formatter.internal('casenumber', test);
			assert.equal(test, source);
		}
		test = formatter.internal('casenumber', '101/98');
		assert.equal(test, 19980101);
		test = formatter.internal('casenumber', '101/10');
		assert.equal(test, 20100101);
	});

	it("Should convert to a date", function() {
		let source = '2015-10-23';
		let result = '23-10-2015';

		let test = formatter.display('datetime', source, 'DD-MM-YYYY');
		assert.equal(test, result);

		test = formatter.internal('datetime', result, 'DD-MM-YYYY');
		assert.equal(test, source);
	});

	it("Should be empty", function() {
		assert.equal(undefined, formatter.display(undefined, undefined));
		assert.equal('', formatter.display(undefined, null));
		assert.equal('', formatter.display(undefined, 'null'));
		assert.notEqual('', formatter.display('string', 'x'));
	});

	it("Should have a value", function() {
		assert.equal('x', formatter.display(undefined, 'x'));
		assert.equal('x', formatter.internal(undefined, 'x'));
		assert.equal('x', formatter.display('string', 'x'));
		assert.equal('x', formatter.internal('string', 'x'));
		assert.equal('x', formatter.display('date', 'x'));
		assert.equal('x', formatter.internal('date', 'x'));
		assert.equal('x', formatter.display('number', 'x'));
		assert.equal('x', formatter.internal('number', 'x'));
		assert.equal('x', formatter.display('casenumber', 'x'));
		assert.equal('x', formatter.internal('casenumber', 'x'));
	});
});
