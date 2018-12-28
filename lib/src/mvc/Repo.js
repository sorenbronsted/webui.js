const collect = require('collect.js');

class Repo {

	constructor() {
		this._objects = collect({});
	}

	add(object) {
		this._objects.put(object.constructor.name, object);
	}

	get(name) {
		let result = this._objects.get(name);
		if (result == null) {
			throw new Error(`Object not found: ${name}`);
		}
		return result;
	}
}

exports.Repo = Repo;
