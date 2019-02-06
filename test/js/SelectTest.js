
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
		let css = new ui.CssDelegate();
		view = new TestView(browser.window,
			`<div data-class="MyClass"><select data-property="value_uid" data-list="MyValue" data-list-display="text"></select></div>`);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.equal(view.isVisible, false);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);

		view.show();
		let select = doc.querySelector("select");
		assert.equal(select.value, '');
		assert.equal(select.length, 0);

		// Populate
		let object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"value_uid":1}}'));
		let values = new MyValue();
		values.addAll(collect(JSON.parse('[{"MyValue":{"uid":1,"text":"load 1"}},{"MyValue":{"uid":2,"text":"load 2"}}]')));

		view.populate(MyClass.name, object.getAll().first());
		view.populate(MyValue.name, values.getAll());

		// Should contain value
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);

		assert.equal(select.length, 3);
		assert.equal(select.value, '1');
	});

	it('Should have a datalist', function() {
		let list = view.dataLists;
		assert.notEqual(list, null);
		assert.equal(list.count(), 1);
		assert.equal(list.first(), MyValue.name);
	});

	it('Should be valid on focus', function() {
		view.isValid = false;
		assert.equal(view.isValid, false);

		view.show();
		let elem = doc.querySelector("select");
		elem.focus();
		assert.equal(view.isValid, true);
	});

	it('Should be dirty on text change', function() {
		assert.equal(view.isDirty, false);
		view.show();
		let elem = doc.querySelector("select");
		let e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
		assert.equal(view.eventName, view.eventPropertyChanged);
	});
});
