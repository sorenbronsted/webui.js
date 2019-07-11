
const {JSDOM} = require("jsdom");
const assert = require('assert');
const moment = require('moment');
const collect = require('collect.js');
const numeral = require('numeral');
const locales = require('numeral/locales');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestView = require('./utils/TestView').TestView;
const TestBrowser = require('./utils/TestBrowser').TestBrowser;

class MyClass extends mvc.BaseProxy {}

describe('InputValidator tests', function() {

	let validator;
	let view;
	let css;

	beforeEach(function() {
		validator = new ui.InputValidator(new ui.InputCss());
	});

	it('Should validate email', function() {
		let fixture = "me@somewhere.net";
		let browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass"><input data-property="email" data-type="email" value="${fixture}"></div>`);

		let object = new MyClass();
		object.add(JSON.parse(`{"MyClass":{"uid":1,"email":"${fixture}"}}`));

		view.show();
		view.populate(MyClass.name, object.getAll());

		let element = new ui.Input(view, browser.window.document.querySelector("input"), MyClass.name);
		assert.strictEqual(validator.validate(element), true);
	});

	it('Should pass email validation', function() {
		let fixture = "me@somewhere.net";
		assert.strictEqual(validator.email(fixture), fixture);
	});

	it('Should fail email validation', function() {
		assert.throws(() => {validator.email('me');}, ui.ValidationException);
	});

	it('Should pass require validation', function() {
		try {
			let fixture = 'test';
			validator.required(fixture);
			assert.ok(true, 'Exception not expected');
		}
		catch(e) {
			if (e instanceof ui.ValidationException) {
				assert.fail(e.toString());
			}
			else {
				throw e;
			}
		}
	});

	it('Should fail require validation', function() {
		assert.throws(() => {validator.required(' ');}, ui.ValidationException);
	});

	it('Should pass date validation', function() {
		try {
			let date = new Date().setDate(1);
			assert.strictEqual(validator.date('1','YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'));
			// note, months a zero indexed in js, hence month 1 = february
			date = new Date().setMonth(1,1);
			assert.strictEqual(validator.date('012','YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'));
			// note, months a zero indexed in js, hence month 1 = february
			date = new Date(2018,1,1);
			assert.strictEqual(validator.date('010218','YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'));
		}
		catch(e) {
			if (e instanceof ui.ValidationException) {
				assert.fail(e.toString());
			}
			else {
				throw e;
			}
		}
	});

	it('Should fail date validation', function() {
		let fixtures = collect(['ab', '0102030405']);
		fixtures.each(fixture => {
			assert.throws(() => {validator.date(fixture);}, ui.ValidationException, fixture);
		});
	});

	it('Should pass time validation', function() {
		try {
			let date = new Date();
			date.setHours(13,0,0);
			assert.strictEqual(validator.time('13','HH:mm:ss'), moment(date).format('HH:mm:ss'));
			date.setHours(2,10);
			assert.strictEqual(validator.time('0210','HH:mm:ss'), moment(date).format('HH:mm:ss'));
			date.setHours(13,14,16);
			assert.strictEqual(validator.time('131416','HH:mm:ss'), moment(date).format('HH:mm:ss'));
		}
		catch(e) {
			if (e instanceof ui.ValidationException) {
				assert.fail(e.toString());
			}
			else {
				throw e;
			}
		}
	});

	it('Should fail time validation', function() {
		let fixtures = collect(['021', '0102030405']);
		fixtures.each(fixture => {
			assert.throws(() => {validator.time(fixture);}, ui.ValidationException, fixture);
		});
	});

	it('Should pass datetime validation', function() {
		try {
			let date = new Date();
			// note, months a zero indexed in js, hence month 11 = december
			date.setFullYear(2018,11,5);
			date.setHours(13,0,0);
			assert.strictEqual(validator.datetime('051218 13','YYYY-MM-DD HH:mm:ss'), moment(date).format('YYYY-MM-DD HH:mm:ss'));
		}
		catch(e) {
			if (e instanceof ui.ValidationException) {
				assert.fail(e.toString());
			}
			else {
				throw e;
			}
		}
	});

	it('Should fail datetime validation', function() {
		let fixtures = collect(['01 02 30']);
		fixtures.each(fixture => {
			assert.throws(() => {validator.time(fixture);}, ui.ValidationException, fixture);
		});
	});

	it('Should pass caseNumber validation', function() {
		try {
			assert.strictEqual(validator.caseNumber(''), '');
			assert.strictEqual(validator.caseNumber('10/01'), '10/01');
			assert.strictEqual(validator.caseNumber('20010010'), '20010010');
		}
		catch(e) {
			if (e instanceof ui.ValidationException) {
				assert.fail(e.toString());
			}
			else {
				throw e;
			}
		}
	});

	it('Should fail caseNumber validation', function() {
		let fixtures = collect(['1', '10/10/10', '2010201020']);
		fixtures.each(fixture => {
			assert.throws(() => {validator.caseNumber(fixture);}, ui.ValidationException, fixture);
		});
	});

	it('Should pass number validation', function() {
		numeral.locale('da-dk');
		try {
			assert.strictEqual(validator.number('123', '0,00'), '123');
			assert.strictEqual(validator.number('1234', '0,000'), '1.234');
			assert.strictEqual(validator.number('1,23', '0.00'), '1,23');
			assert.strictEqual(validator.number('1234,56', '0,000.00'), '1.234,56');
		}
		catch(e) {
			if (e instanceof ui.ValidationException) {
				assert.fail(e.toString());
			}
			else {
				throw e;
			}
		}
	});
});
