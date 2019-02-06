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
		let encodedData = this.encodeMap(data);
		return this._execute('POST', url, encodedData, 'application/x-www-form-urlencoded');
	}

	postFiles(url, formData) {
		return this._execute('POST', url, formData);
	}

	delete(url) {
		return this._execute('DELETE', url);
	}

	encodeMap(params) {
		if (params === undefined) {
			return '';
		}
		if (params.constructor.name === 'Object') {
			params = collect(params);
		}
		else if (params.constructor.name !== 'Collection') {
			throw Error(`argument must be of type Collection`);
		}
		let s = '';
		params.keys().each(key => {
			let value = params.get(key);
			let part = '';
			if (value === null || value === undefined) {
				part = 'null';
			}
			else {
				switch(value.constructor.name) {
					case 'Collection':
						part = value.toJson();
						break;
					case 'Object':
						part = JSON.stringify(value);
						break;
					default:
						part = value;
				}
			}
			if (s.length > 0) {
				s = s.concat('&');
			}
			s = s.concat(`${key}=${part}`);
		});
		return encodeURI(s);
	}

	_execute(method, url, parameters, encoding) {
		let self = this;
		return new Promise(function(resolve, reject) {
			// Create a copy
			let handler = new self._handlerClass();
			handler.open(method, url);

			if (encoding != null) {
				handler.setRequestHeader('Content-type', encoding);
			}

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

			handler.send(parameters);
		});
	}
}

exports.Rest = Rest;
