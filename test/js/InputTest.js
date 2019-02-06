
const {JSDOM} = require("jsdom");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestView = require('./utils/TestView').TestView;

class MyClass extends mvc.BaseProxy {}

describe('Input', function() {

	let object;
	let view;
	let doc;

	beforeEach(function() {
		let browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass">
				<input data-property="text">
				<input type="file" data-property="file">
				<input type="checkbox" value="1" data-property="checkbox">
				<input type="file" data-property="file">
				<input type="radio" value="male" id="male" checked data-property="gender">
				<input type="radio" value="female" id="female" data-property="gender">
			</div>
		`);
		doc = browser.window.document;
		object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"text":"load", "checkbox":"1", "gender":"female"}}'));
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.equal(view.isVisible, false);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);

		// Make visible
		view.show();

		let text = doc.querySelector("input[data-property=text]");
		let checkbox = doc.querySelector("input[data-property=checkbox]");
		let file = doc.querySelector("input[data-property=file]");
		let male = doc.querySelector("#male");
		let female = doc.querySelector("#female");
		assert.equal(text.value, '');
		assert.equal(file.value, '');
		assert.equal(checkbox.checked, false);
		assert.equal(male.checked, true);
		assert.equal(female.checked, false);

		// Populate it
		view.populate(MyClass.name, object.getAll().first());

		// Should contain value
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);
		assert.equal(text.value, 'load');
		assert.equal(file.value, '');
		assert.equal(checkbox.checked, true);
		assert.equal(male.checked, false);
		assert.equal(female.checked, true);
	});

	it('Should be valid on focus', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		view.isValid = false;
		assert.equal(view.isValid, false);
		elem.focus();
		assert.equal(view.isValid, true);
	});

	it('Should be dirty on keypress', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		assert.equal(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('keypress', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
	});

	it('Should be dirty on text change', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		assert.equal(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
	});

	it('Should be dirty on file change', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=file]");
		assert.equal(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
	});

	it('Should be dirty on checkbox change', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=checkbox]");
		assert.equal(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
	});

	it('Should be dirty on radio change', function() {
		view.show();
		let elem = doc.querySelector("#male");
		assert.equal(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
	});

	it('Should fire event on blur', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		elem.value = 'test';
		elem.focus();
		elem.blur();
		assert.equal(view.eventName, view.eventPropertyChanged);
	});

	it('Should fire event on key enter', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		let e = doc.createEvent('HTMLEvents');
		e.initEvent('keydown', false, true);
		e.keyCode = 13;
		elem.dispatchEvent(e);
		assert.equal(view.eventName, view.eventPropertyChanged);
	});
});
