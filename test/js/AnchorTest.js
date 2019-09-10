
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestView = require('./utils/TestView.js').TestView;

describe('Anchor', function() {

	let browser;
	let view;
	let object;

	beforeEach(function() {
		browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="BaseProxy"><a data-property="name" data-uid="1" data-type="menu"></a></div>`);
		object = new mvc.BaseProxy();
		object.add(JSON.parse('{"BaseProxy":{"uid":1,"name":"load","selected":"true","visible":"true"}}'));
		view.show();
		view.populate(mvc.BaseProxy.name, object.get(1));
	});

	it('Should populate', function() {
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);
		let elem = browser.window.document.querySelector("a");
		assert.notStrictEqual(elem, null);
		assert.strictEqual(elem.style.active, 'selected');
		assert.strictEqual(elem.href, `${browser.location}load`);
	});

	it('Should validateAndfire', function() {
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);
		let elem = browser.window.document.querySelector("a");
		elem.click();
		assert.strictEqual(view.eventName, view.eventClick);
		assert.strictEqual(view.isValidRequired, true);
		assert.strictEqual(view.body.cls, mvc.BaseProxy.name);
		assert.strictEqual(view.body.property, 'name');
		assert.strictEqual(view.body.uid, 1);
		assert.strictEqual(view.body.value, `${browser.location}load`);
	});
});
