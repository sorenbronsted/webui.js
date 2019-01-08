
const collect = require('collect.js');

class ApplicationException {
	constructor(error) {
		this.error = error;
	}
}

exports.ApplicationException = ApplicationException;

class Rest {

	constructor(handler) {
		this._handler = handler;
	}
	
	get(url) {
		return this._execute('GET', url);
	}

	post(url, data) {
		let encodedData = this.encodeMap(data);
		return this._execute('POST', url, encodedData, 'application/x-www-form-urlencoded');
	}

	postFile(url, formData) {
		return this._execute('POST', url, formData);
	}

	delete(url) {
		return this._execute('DELETE', url);
	}

	encodeMap(params) {
		let pairs = collect([]);
		if (params.constructor.name === 'Object') {
			params = collect(params);
		}
		params.keys().each(key => { pairs.push(`${key}=${params.get(key)}`); });
		return encodeURI(pairs.implode('&'));
	}

	_execute(method, url, parameters, encoding) {
		let self = this;
		return new Promise(function(resolve, reject) {
			self._handler.open(method, url);

			if (encoding != null) {
				self._handler.setRequestHeader('Content-type', encoding);
			}

			self._handler.onload = function() {
				if (this.readyState === 4) {
					if (self._handler.status === 200) {
						let result = '';
						if (self._handler.responseText.length > 0) {
							if (self._handler.getResponseHeader('content-type').match(/json/)) {
								let data = JSON.parse(self._handler.responseText);
								if (data !== null && data['error']) {
									reject(new ApplicationException(data['error']));
								}
								result = data;
							}
							else {
								result = self._handler.responseText;
							}
						}
						resolve(result);
					}
					else {
						reject(new Error(self._handler.status));
					}
				}
			};

			self._handler.onerror = function() {
				reject(new Error("Network Error"));
			};

			self._handler.send(parameters);
		});
	}
}

exports.Rest = Rest;