
const {JSDOM} = require("jsdom");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const TestObserver = require('./utils/TestObserver.js').TestObserver;
const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestStore = require('./utils/TestStore.js').TestStore;

describe('Router', function() {

	let browser;
	let observer;
	let router;
	let url;

	beforeEach(function() {
		browser = new TestBrowser();
		url = browser.location;
		let repo = new mvc.Repo();
		router = new mvc.Router(browser);
		repo.add(router);
		repo.add(new mvc.CrudProxy(new TestStore()));
		observer = new TestObserver(repo);
	});

	it('Should goto the given url', function() {
		assert.strictEqual(browser.history.length, 1);
		assert.strictEqual(browser.history.state, null);
		router.goto('somewhere');
		assert.strictEqual(browser.history.length, 2);
		assert.strictEqual(browser.location, url+"somewhere");
		assert.strictEqual(observer.root.sender, mvc.Router.name);
		assert.strictEqual(observer.root.name, router.eventOk);
		assert.strictEqual(observer.root.body, 'somewhere');
	});

	it('Should goto the given url from the pop state event', function() {
		router.goto('somewhere');
		assert.strictEqual(browser.location, url+"somewhere");
		browser.history.back();
		assert.strictEqual(observer.root.body, '/');
	});

	it('Should goto then given url from back', function() {
		router.goto(url+'somewhere1');
		router.goto(url+'somewhere2');
		assert.strictEqual(browser.location, url+'somewhere2');
		router.back();
		assert.strictEqual(browser.location, url+'somewhere1');
	});

	it('Should goto the given url from reload', function() {
		router.goto(url+'somewhere');
		router.reload();
		assert.strictEqual(observer.root.body, '/somewhere');
	});
});