
const collect = require('collect.js');

class FormData {
	constructor() {
		this._data = collect({});
	}

	append(name, value) {
		this._data.put(name, value);
	}

	get json() {
		return this._data.toJson();
	}
}
exports.FormData = FormData;