
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
		object.add(JSON.parse('{"BaseProxy":{"uid":1,"name":"load","active":"true"}}'));
		view.show();
		view.populate(mvc.BaseProxy.name, object.getAll().first());
	});

	it('Should populate', function() {
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);
		let elem = browser.window.document.querySelector("a");
		assert.notEqual(elem, null);
		assert.equal(elem.style.active, 'active');
		assert.equal(elem.href, `${browser.location}load`);
	});

	it('Should validateAndfire', function() {
		assert.equal(view.isVisible, true);
		assert.equal(view.isDirty, false);
		assert.equal(view.isValid, true);
		let elem = browser.window.document.querySelector("a");
		elem.click();
		assert.equal(view.eventName, view.eventClick);
		assert.equal(view.isValidRequired, true);
		assert.equal(view.body.cls, mvc.BaseProxy.name);
		assert.equal(view.body.property, 'name');
		assert.equal(view.body.uid, '1');
		assert.equal(view.body.value, `${browser.location}load`);
	});
});
