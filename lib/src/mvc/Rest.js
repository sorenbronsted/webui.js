'use strict';

const collect = require('collect.js');

class ApplicationException {
	constructor(error) {
		this.error = error;
	}
}
exports.ApplicationException = ApplicationException;

class Rest {

	constructor(handlerClass) {
		this._handlerClass = handlerClass;
	}
	
	get(url) {
		return this._execute('GET', url);
	}

	post(url, data) {
		if (data.constructor.name !== 'FormData') {
			throw Error('Data must of type FormData');
		}
		return this._execute('POST', url, data);
	}

	delete(url) {
		return this._execute('DELETE', url);
	}

	_execute(method, url, data) {
		let self = this;
		return new Promise(function(resolve, reject) {
			// Create a copy
			let handler = new self._handlerClass();
			handler.open(method, url);

			handler.onload = function() {
				if (this.readyState === 4) {
					if (handler.status === 200) {
						let result = '';
						if (handler.responseText.length > 0) {
							if (handler.getResponseHeader('content-type').match(/json/)) {
								let data = JSON.parse(handler.responseText);
								if (data !== null && data['error']) {
									reject(new ApplicationException(data['error']));
								}
								result = data;
							}
							else {
								result = handler.responseText;
							}
						}
						resolve(result);
					}
					else {
						reject(new Error(handler.status));
					}
				}
			};

			handler.onerror = function() {
				reject(new Error("Network Error"));
			};

			handler.send(data);
		});
	}
}
exports.Rest = Rest;
