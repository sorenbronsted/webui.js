
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
	let observer;

	beforeEach(function() {
		let browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass">
				<input data-property="text" autofocus>
				<input type="file" data-property="file">
				<input type="checkbox" value="1" data-property="checkbox">
				<input type="file" data-property="file">
				<input type="radio" value="male" id="male" checked data-property="gender">
				<input type="radio" value="female" id="female" data-property="gender">
			</div>
		`);
		doc = browser.window.document;
		object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"text":"load", "checkbox":1, "gender":"female"}}'));
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.strictEqual(view.isVisible, false);
		assert.strictEqual(view.isValid, true);

		// Make visible
		view.show();

		let text = doc.querySelector("input[data-property=text]");
		let checkbox = doc.querySelector("input[data-property=checkbox]");
		let file = doc.querySelector("input[data-property=file]");
		let male = doc.querySelector("#male");
		let female = doc.querySelector("#female");
		assert.strictEqual(text.value, '');
		assert.strictEqual(file.value, '');
		assert.strictEqual(checkbox.checked, false);
		assert.strictEqual(male.checked, true);
		assert.strictEqual(female.checked, false);

		// Populate it
		view.populate(MyClass.name, object.get(1));

		// Should contain value
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isValid, true);
		assert.strictEqual(text.value, 'load');
		assert.strictEqual(file.value, '');
		assert.strictEqual(checkbox.checked, true);
		assert.strictEqual(male.checked, false);
		assert.strictEqual(female.checked, true);
	});

	it('Should not change when populated with empty data', function() {
		view.show();
		let input = doc.querySelector("input[data-property=text]");
		input.value = '1';
		assert.strictEqual(input.value, '1');

		view.populate(MyClass.name, null);
		assert.strictEqual(input.value, '1');

		view.populate(MyClass.name, '');
		assert.strictEqual(input.value, '1');
	});

	it('Should be valid on focus', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		elem.focus();
		assert.strictEqual(view.isValid, true);
	});

	it('Should be dirty on keypress', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('keypress', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 1);
		assert.strictEqual(view.events.get(0).name, view.eventPropertyChanged);
		assert.strictEqual(view.events.get(0).body.property, 'isDirty');
		assert.strictEqual(view.events.get(0).body.value, true);
	});

	it('Should be dirty on text change', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 1);
		assert.strictEqual(view.events.get(0).name, view.eventPropertyChanged);
		assert.strictEqual(view.events.get(0).body.property, 'isDirty');
		assert.strictEqual(view.events.get(0).body.value, true);
	});

	it('Should be dirty on file change', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=file]");
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 2);
		assert.strictEqual(view.events.get(0).name, view.eventPropertyChanged);
		assert.strictEqual(view.events.get(0).body.property, 'isDirty');
		assert.strictEqual(view.events.get(0).body.value, true);
		assert.strictEqual(view.events.get(1).name, view.eventPropertyChanged);
		assert.strictEqual(view.events.get(1).body.property, 'file');
		assert.notStrictEqual(view.events.get(1).body.value, null);
	});

	it('Should be dirty on checkbox change', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=checkbox]");
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 2);
		assert.strictEqual(view.events.get(0).body.value, true);
		assert.strictEqual(view.events.get(1).body.value, 0); // because it is not checked
	});

	it('Should be dirty on radio change', function() {
		view.show();
		let elem = doc.querySelector("#male");
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 2);
		assert.strictEqual(view.events.get(0).body.value, true);
		assert.strictEqual(view.events.get(1).body.value, 'male'); // because it is not checked
	});

	it('Should fire event on blur for type text', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		elem.value = 'test';
		elem.focus();
		elem.blur();
		assert.strictEqual(view.events.count(), 1);
		assert.strictEqual(view.events.get(0).name, view.eventPropertyChanged);
	});

	it('Should fire event on key enter', function() {
		view.show();
		let elem = doc.querySelector("input[data-property=text]");
		let e = doc.createEvent('HTMLEvents');
		e.initEvent('keydown', false, true);
		e.keyCode = 13;
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 1);
		assert.strictEqual(view.events.get(0).name, view.eventPropertyChanged);
	});
});
