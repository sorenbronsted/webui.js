
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
			`<div data-class="BaseProxy"><a data-property="name"></a></div>`);
		object = new mvc.BaseProxy();
		object.add(JSON.parse('{"class":"BaseProxy","uid":1,"name":"load"}'));
		view.show();
		view.populate(mvc.BaseProxy.name, object.get(1));
	});

	it('Should populate', function() {
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isValid, true);
		let elem = browser.window.document.querySelector("a");
		assert.notStrictEqual(elem, null);
		assert.strictEqual(elem.href, `${browser.location}load`);
	});

	it('Should validateAndfire', function() {
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isValid, true);
		let elem = browser.window.document.querySelector("a");
		elem.click();
		assert.strictEqual(view.events.count(), 1);
		assert.strictEqual(view.events.get(0).name, view.eventClick);
		assert.strictEqual(view.events.get(0).body.cls, mvc.BaseProxy.name);
		assert.strictEqual(view.events.get(0).body.property, 'name');
		assert.strictEqual(view.events.get(0).body.uid, 1);
		assert.strictEqual(view.events.get(0).body.value, `${browser.location}load`);
	});
});
