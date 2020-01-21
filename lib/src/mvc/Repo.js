const collect = require('collect.js');

/**
 * The class hold a collectoin of subjects typical proxies.
 */
class Repo {

	constructor() {
		this._objects = collect({});
	}

	/**
	 * Add an subject to the collection
	 * @param {Subject} object
	 */
	add(object) {
		this._objects.put(object.constructor.name, object);
	}

	/**
	 * Gets a subject by class name
	 * @param {string} name
	 * 	The class name of the subject
	 * @returns {Subject}
	 * 	If found return the subject otherwise throws an exception
	 * @throws {Error}
	 */
	get(name) {
		let result = this._objects.get(name);
		if (result == null) {
			throw new Error(`Object not found: ${name}`);
		}
		return result;
	}
}

exports.Repo = Repo;
