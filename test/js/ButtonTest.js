
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
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
		object.add(JSON.parse('{"class":"MyClass","uid":1,"name":"load","active":"true"}'));
		view.show();
		view.populate(MyClass.name, object.get(1));
	});

	it('button.validateAndfire', function() {
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isValid, true);
		let elem = browser.window.document.querySelector("button");
		elem.click();
		assert.strictEqual(view.events.count(), 1);
		assert.strictEqual(view.events.get(0).name, 'save');
		assert.strictEqual(view.events.get(0).body.cls, MyClass.name);
		assert.strictEqual(view.events.get(0).body.property, 'save');
		assert.strictEqual(view.events.get(0).body.uid, 1);
		assert.ok(view.events.get(0).body.value == null);
	});
});
