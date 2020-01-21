const collect = require('collect.js');
const Store = require('./Store.js').Store;

/**
 * This class implements the Store api and transforms it to librest rest calls.
 * @implements Store
 */
class RestStore extends Store {
	constructor(rest, formDataConstructor) {
		super();
		this._rest = rest;
		this._formDataConstructor = formDataConstructor;
	}

	read(cls, params, method) {
		let url = `/rest/${cls}`;

		if (params !== undefined && params.keys().isNotEmpty()) {
			if (params.constructor.name !== 'Collection') {
				throw Error(`Parameters is of unsuported type: ${params.constructor.name}`);
			}

			if (params.has('uid')) {
				url = url.concat('/', params.get('uid'));
				params.forget('uid');
			}
			if (method != null) {
				url = url.concat('/', method);
			}
			if (!params.keys().isEmpty()) {
				let args = this._encodeMap(params);
				url = url.concat('?', args);
			}
		}
		else {
			if (method != null) {
				url = url.concat('/', method);
			}
		}
		return this._rest.get(url);
	}

	delete(cls, uid) {
		if (uid === undefined) {
			throw Error("Must a have an uid");
		}
		return this._rest.delete(`/rest/${cls}/${uid}`);
	}

	update(cls, data, method) {
		let url = `/rest/${cls}`;
		if (data.uid !== undefined) {
			url = url.concat('/', data.uid);
		}
		if (method !== undefined) {
			url = url.concat('/', method);
		}
		let formData = this._formData(data);
		return this._rest.post(url, formData);
	}

	_encodeMap(data) {
		if (data.constructor.name !== 'Collection') {
			throw Error(`Data is of unsuported type: ${data.constructor.name}`);
		}
		let result = '';
		data.each((value, name) => {
			if (result.length > 0) {
				result = result.concat(('&'));
			}
			if (value === undefined || value === null) {
				value = 'null';
			}
			else if (value.constructor.name === 'Object') {
				value = JSON.stringify(value);
			}
			result = result.concat(name,'=',encodeURI(value));
		});
		return result;
	}

	_formData(data) {
		let result = new this._formDataConstructor();
		if (data === undefined || data === null) {
			return result;
		}
		switch(data.constructor.name) {
			case 'Collection':
				data.each((value, key) => this._populate(result, key, value));
				break;
			case 'Object':
				collect(data).each((value, key) => this._populate(result, key, value));
				break;
			case 'FileList':
				for (let i = 0; i < data.length; i++) {
					result.append('files[]', data[i]);
				}
				break;
			default:
				throw Error(`Data is of unsuported type: ${data.constructor.name}`);
		}
		return result;
	}

	_populate(formData, name, value) {
		if (value == null) {
			formData.append(name, value);
		}
		else {
			switch(value.constructor.name) {
				case 'Collection':
					formData.append(name, value.toJson());
					break;
				case 'Object':
					formData.append(name, JSON.stringify(value));
					break;
				case 'File':
					formData.append(name, value);
					break;
				case 'FileList':
					for (let i = 0; i < value.length; i++) {
						formData.append(`${name}[]`, value[i]);
					}
					break;
				default:
					formData.append(name, value);
			}
		}
	}
}
exports.RestStore = RestStore;
