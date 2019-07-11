
const {JSDOM} = require("jsdom");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestView = require('./utils/TestView').TestView;
const TestBrowser = require('./utils/TestBrowser').TestBrowser;

class MyClass extends mvc.BaseProxy {}

describe('TextArea', function() {

	let object;
	let view;
	let doc;

	beforeEach(function() {
		object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"text":"load", "checkbox":"1", "gender":"female"}}'));

		let browser = new TestBrowser();
			view = new TestView(browser.window, `<div data-class="MyClass"><textarea data-property="text"></textarea></div>`
		);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.strictEqual(view.isVisible, false);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);

		view.show();
		let text = doc.querySelector("textarea[data-property=text]");
		assert.strictEqual(text.value, '');

		// Populate
		view.populate(MyClass.name, object.get(1));

		// Should contain value
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);
		assert.strictEqual(text.value, 'load');
	});

	it('Should be valid on focus', function() {
		view.isValid = false;
		assert.strictEqual(view.isValid, false);

		view.show();
		let elem = doc.querySelector("textarea[data-property=text]");
		elem.focus();
		assert.strictEqual(view.isValid, true);
	});

	it('Should be dirty on keypress', function() {
		view.show();
		let elem = doc.querySelector("textarea[data-property=text]");
		assert.strictEqual(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('keypress', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.isDirty, true);
	});

	it('Should fire event on blur', function() {
		view.show();
		let elem = doc.querySelector("textarea[data-property=text]");
		elem.focus();
		elem.blur();
		assert.strictEqual(view.eventName, view.eventPropertyChanged);
	});
});
