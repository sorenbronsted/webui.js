
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
		assert.equal(browser.history.length, 1);
		assert.equal(browser.history.state, null);
		router.goto('somewhere');
		assert.equal(browser.history.length, 2);
		assert.equal(browser.location, url+"somewhere");
		assert.equal(observer.sender, mvc.Router.name);
		assert.equal(observer.body, 'somewhere');
	});

	it('Should goto the given url from the pop state event', function() {
		router.goto('somewhere');
		observer.reset();
		assert.equal(browser.location, url+"somewhere");
		browser.history.back();
		assert.equal(observer.body, '/');
	});

	it('Should goto then given url from back', function() {
		router.goto(url+'somewhere1');
		router.goto(url+'somewhere2');
		assert.equal(browser.location, url+'somewhere2');
		router.back();
		assert.equal(browser.location, url+'somewhere1');
	});

	it('Should goto the given url from reload', function() {
		router.goto(url+'somewhere');
		observer.reset();
		router.reload();
		assert.equal(observer.body, '/somewhere');
	});
});