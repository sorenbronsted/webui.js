
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
		view = new TestView(browser.window, `<div data-class="MyClass"><span data-property="text"></span></div>`);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.strictEqual(view.isVisible, false);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);

		view.show();
		let span = doc.querySelector("span");
		assert.notStrictEqual(span, null);
		assert.strictEqual(span.innerHTML, '');

		// Populate
		object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"text":"load"}}'));
		view.populate(MyClass.name, object.get(1));

		// Should contain value
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);
		assert.strictEqual(span.innerHTML, 'load');
	});
});
