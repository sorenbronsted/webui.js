
const collect = require('collect.js');

class TestXmlHttpRequest {
	get readyState() {
		return this._readyState;
	}

	set readyState(value) {
		this._readyState = value;
	}
	constructor() {
		this._status = null;
		this._responseText = null;
		this._responseHeader = {};
		this._readyState = 4;
		this.header = collect({});
		this.networkError = false;
	}

	getResponseHeader(name) {
		return this._responseHeader[name];
	}

	setResponseHeader(name, value) {
		this._responseHeader[name] = value;
	}

	set onload(fn) {
		this._onload = fn;
	}

	set onerror(fn) {
		this._onerror = fn;
	}

	get status() {
		return this._status;
	}

	set status(status) {
		this._status = status;
	}

	get responseText() {
		return this._responseText;
	}

	set responseText(responseText) {
		this._responseText = responseText;
	}

	open(method, url) {
		this.method = method;
		this.url = url;
	}

	setRequestHeader(name, value) {
		this.header[name] = value;
	}

	send(parameters) {
		this.parameters = parameters;
		if (this.networkError) {
			this._onerror()
		}
		else {
			this._onload();
		}
	}
}

exports.TestXmlHttpRequest = TestXmlHttpRequest;