
const collect = require('collect.js');

class TestHistory {
	constructor(url) {
		this._url = url;
		this._history = collect([]);
		this._onpopstate = null;
		this.pushState(null, null, url);
	}

	get length() {
		return this._history.count();
	}

	get state() {
		return this._history.count() > 0 ? this._history.last().data : null;
	}

	get location() {
		return this._history.count() > 0 ? this._history.last().url : null;
	}

	set onpopstate(fn) {
		this._onpopstate = fn;
	}

	pushState(data, title, url) {
		if (!url.match(/^http/)) {
			url = this._url+(url.charAt(0) === '/' ? url.substr(1) : url);
		}
		this._history.push({data:data,title:title,url:url})
	}

	back() {
		if (this._history.count() > 1) {
			this._history.pop();
			if (this._onpopstate !== null) {
				this._onpopstate.call(this, {state:this._history.last().data, preventDefault:function(){} });
			}
		}
	}
}
exports.TestHistory = TestHistory;
