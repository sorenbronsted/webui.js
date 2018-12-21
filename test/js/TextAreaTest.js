
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
		let css = new ui.CssDelegate();
		view = new TestView(browser.window, `<div data-class="MyClass"><textarea data-property="text"></textarea></div>`
		);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.equal(view.isVisible, false);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);

		view.show();
		let text = doc.querySelector("textarea[data-property=text]");
		assert.equal(text.value, '');

		// Populate
		view.populate(MyClass.name, object.getAll().first());

		// Should contain value
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);
		assert.equal(text.value, 'load');
	});

	it('Should be valid on focus', function() {
		view.isValid = false;
		assert.equal(view.isValid, false);

		view.show();
		let elem = doc.querySelector("textarea[data-property=text]");
		elem.focus();
		assert.equal(view.isValid, true);
	});

	it('Should be dirty on keypress', function() {
		view.show();
		let elem = doc.querySelector("textarea[data-property=text]");
		assert.equal(view.isDirty, false);
		var e = doc.createEvent('HTMLEvents');
		e.initEvent('keypress', false, true);
		elem.dispatchEvent(e);
		assert.equal(view.isDirty, true);
	});

	it('Should fire event on blur', function() {
		view.show();
		let elem = doc.querySelector("textarea[data-property=text]");
		elem.focus();
		elem.blur();
		assert.equal(view.eventName, view.eventPropertyChanged);
	});
});
