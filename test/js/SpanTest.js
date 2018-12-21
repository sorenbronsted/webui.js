
const {JSDOM} = require("jsdom");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestView = require('./utils/TestView').TestView;
const TestBrowser = require('./utils/TestBrowser').TestBrowser;

class MyClass extends mvc.BaseProxy {}

describe('Span', function() {

	let object;
	let view;
	let doc;

	beforeEach(function() {
		let browser = new TestBrowser();
		let css = new ui.CssDelegate();
		view = new TestView(browser.window, `<div data-class="MyClass"><span data-property="text"></span></div>`);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.equal(view.isVisible, false);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);

		view.show();
		let span = doc.querySelector("span");
		assert.notEqual(span, null);
		assert.equal(span.innerHTML, '');

		// Populate
		object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"text":"load"}}'));
		view.populate(MyClass.name, object.getAll().first());

		// Should contain value
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);
		assert.equal(span.innerHTML, 'load');
	});
});
