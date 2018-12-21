
const {JSDOM} = require("jsdom");
const TestHistory = require('./TestHistory').TestHistory;

class TestBrowser {

	constructor(url = 'https://example.org/') {
		this._browser = new JSDOM(`<!DOCTYPE html><div id="content"></div>`, {
			url: url,
			contentType: "text/html",
		});
		this._history = new TestHistory(url);
	}

	get jsdom() {
		return this._browser;
	}

	get window() {
		return this._browser.window;
	}

	get history() {
		return this._history;
	}

	get location() {
		return this._history.location;
	}

	set onpopstate(handler) {
		this._history._onpopstate = handler;
	}
}

exports.TestBrowser = TestBrowser;