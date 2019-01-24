
const collect = require('collect.js');

let _responseText;
let _status;
let _responseHeader;
let _header;
let _networkError;
let _parameters;

class TestXmlHttpRequest {
	constructor() {
		this._readyState = 4;
	}

	get readyState() {
		return this._readyState;
	}

	set readyState(value) {
		this._readyState = value;
	}

	set onload(fn) {
		this._onload = fn;
	}

	set onerror(fn) {
		this._onerror = fn;
	}

	getResponseHeader(name) {
		return _responseHeader[name];
	}

	static setResponseHeader(name, value) {
		if (_responseHeader === undefined) {
			_responseHeader = {};
		}
		_responseHeader[name] = value;
	}

	static set networkError(value) {
		_networkError = value;
	}

	static get header() {
		return _header;
	}

	static set header(value) {
		_header = value;
	}

	get status() {
		return _status;
	}

	static get status() {
		return _status;
	}

	static set status(status) {
		_status = status;
	}

	get responseText() {
		return _responseText;
	}

	static get responseText() {
		return _responseText;
	}

	static set responseText(responseText) {
		_responseText = responseText;
	}

	open(method, url) {
		this.method = method;
		this.url = url;
	}

	setRequestHeader(name, value) {
		_header[name] = value;
	}

	static get parameters() {
		return _parameters;
	}

	send(parameters) {
		_parameters = parameters;
		if (_networkError) {
			this._onerror()
		}
		else {
			this._onload();
		}
	}
}

exports.TestXmlHttpRequest = TestXmlHttpRequest;