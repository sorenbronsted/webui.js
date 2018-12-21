
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestView = require('./utils/TestView.js').TestView;

class MyClass extends mvc.BaseProxy {}

describe('Button', function() {

	let url;
	let browser;
	let view;
	let object;

	beforeEach(function() {
		browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass"><button name="save" data-validate="false">save</button></div>`);
		object = new MyClass();
		object.add(JSON.parse('{"MyClass":{"uid":1,"name":"load","active":"true"}}'));
		view.show();
		view.populate(MyClass.name, object.getAll().first());
	});

	it('button.validateAndfire', function() {
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);
		let elem = browser.window.document.querySelector("button");
		elem.click();
		assert.equal(view.eventName, 'save');
		assert.equal(view.isValidRequired, false);
		assert.equal(view.body.cls, MyClass.name);
		assert.equal(view.body.property, 'save');
		assert.equal(view.body.uid, '1');
		assert.equal(view.body.value, null);
	});
});
