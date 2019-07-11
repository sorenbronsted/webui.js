
const {JSDOM} = require("jsdom");
const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestView = require('./utils/TestView').TestView;
const TestBrowser = require('./utils/TestBrowser').TestBrowser;

class MyClass extends mvc.BaseProxy {}

class MyValue extends mvc.BaseProxy {}

describe('Select', function() {

	let view;
	let doc;

	beforeEach(function() {
		let browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass"><select data-property="value_uid" data-list="MyValue" data-list-display="text"></select></div>`);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.strictEqual(view.isVisible, false);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);

		view.show();
		let select = doc.querySelector("select");
		assert.strictEqual(select.value, '');
		assert.strictEqual(select.length, 0);

		// Populate
		let object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"value_uid":1}}'));
		let values = new MyValue();
		values.addAll(collect(JSON.parse('[{"MyValue":{"uid":1,"text":"load 1"}},{"MyValue":{"uid":2,"text":"load 2"}}]')));

		view.populate(MyClass.name, object.get(1));
		view.populate(MyValue.name, values.getAll());

		// Should contain value
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);

		assert.strictEqual(select.length, 2);
		assert.strictEqual(select.value, '1');
	});

	it('Should have a datalist', function() {
		let list = view.dataLists;
		assert.notStrictEqual(list, null);
		assert.strictEqual(list.count(), 1);
		assert.strictEqual(list.first(), MyValue.name);
	});

	it('Should be valid on focus', function() {
		view.isValid = false;
		assert.strictEqual(view.isValid, false);

		view.show();
		let elem = doc.querySelector("select");
		elem.focus();
		assert.strictEqual(view.isValid, true);
	});

	it('Should be dirty on text change', function() {
		assert.strictEqual(view.isDirty, false);
		view.show();
		let elem = doc.querySelector("select");
		let e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.isDirty, true);
		assert.strictEqual(view.eventName, view.eventPropertyChanged);
	});
});
