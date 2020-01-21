const collect = require('collect.js');
const Subject = require('./Subject.js').Subject;

/**
 * The class provide the basic method for handling domain object in a proxy, by having a collection o them.
 * The collections of object are expected to be of the samme class.
 */
class BaseProxy extends Subject {
	constructor() {
		super();
		this._objects = collect({});
		this._dirtyUid = collect({}); // set
		this.cls = this.constructor.name;
		this.sortBy = 'uid';
		this.sortAsc = true;
	}

	/**
	 * Add an object to the collection.
	 * @param {Object} object
	 * 	The object to add, which must have this json format:
	 * 	<code>{SomeClass:[uid:someValue, ....]}</code>
	 * @param {string} cls
	 * 	The overriden name of the cls.
	 */
	add(object, cls) {
		if (cls === undefined) {
			cls = this.cls;
		}
		if (object[cls] === undefined) {
			throw new Error("Proxy and object are not of same class");
		}
		if (object[cls].uid === undefined) {
			throw new Error("Object must have an uid");
		}
		this._objects.put(object[cls].uid, object[cls]);
		this._dirtyUid.forget(object[cls].uid);
	}

	/**
	 * Add a collections of object.
	 * @param {collect}rows
	 * 	The collections
	 * @param {string} cls
	 * 	The overriden name of the cls.
	 */
	addAll(rows, cls) {
		this.clear();
		rows.each(row => {
			this.add(row, cls);
		});
	}

	/**
	 * Remove an object from the collection by uid
	 * @param {int} uid
	 * 	The uid of the object.
	 */
	remove(uid) {
		this._objects.forget(uid);
	}

	/**
	 * Gets an object by uid
	 * @param {int} uid
	 * 	The given uid
	 * @returns {Object|null}
	 * 	If found the object otherwise null
	 */
	get(uid) {
		let result = this._objects.get(uid);
		if (result == null) {
			throw Error('Object not found: '+uid);
		}
		return result;
	}

	/**
	 * Tells whether an object with uid exists or not
	 * @param {int} uid
	 * 	The given uid
	 * @returns {true|false}
	 * 	True if found otherwise false
	 */
	has(uid) {
		return this._objects.has(uid);
	}

	/**
	 * Gets all the object in the collection and names and values of the filter
	 * @returns {Object}
	 * 	An object on the format:
	 * 	<code>{filter:{someName:someValue, ...}, objects:{uid:someValue,...}}</code>
	 */
	getAll() {
		let result = Object.assign({}, this.filterBy);
		if (this.sortAsc) {
			result['objects'] = this._objects.values().sortBy(this.sortBy);
		}
		else {
			result['objects'] = this._objects.values().sortByDesc(this.sortBy);
		}
		return result;
	}

	/**
	 * Tells the current size of the collections of object
	 * @returns {int}
	 * 	The number of objects
	 */
	size() {
		return this._objects.count();
	}

	/**
	 * Sets a property in this or inherited object.
	 * @param {string} name
	 * 	The name of the property
	 * @param {any} value
	 * 	The value of the property
	 */
	setProperty(name, value) {
		if (name in this) {
			this[name] = value;
		}
		else {
			throw Error('Property not found: '+name);
		}
	}

	/**
	 * Sets a property in this or inherited object.
	 * The property and value is fecthed from ElementValue, but if the property in this or inherited object has
	 * appended the name ByElement, the property is passed the full element.
	 * @param {ElementValue} element
	 * 	The property name and value.
	 */
	setPropertyByElement(element) {
		/*
		Setting the property must follow this orderly path, which allows for properties with same
		name as propeties in objects off this proxy.
		 */
		if (element.property+'ByElement' in this) {
			this[element.property+'ByElement'] = element;
		}
		else if (!isNaN(element.uid)) {
			let object = this._objects.get(element.uid);
			object[element.property] = element.value;
			this._dirtyUid.put(element.uid, element.uid);
		}
		else if (element.property in this) {
			this[element.property] = element.value;
		}
		else {
			throw Error('Property not found: '+element.property);
		}
	}

	/**
	 * Gets the default filter for this proxy, which is empty.
	 * @returns {{}}
	 * 	The empty object
	 */
	get filterBy() {
		return {};
	}

	/**
	 * Remove objects from the collection.
	 */
	clear() {
		this._objects = collect({});
		this._dirtyUid = collect({});
	}

	/**
	 * Tells if an object by the uid has been modified
	 * @param {int} uid
	 * @returns {boolean}
	 * 	True if found otherwise false
	 */
	isDirty(uid) {
		return this._dirtyUid.get(uid) != null;
	}
}
exports.BaseProxy = BaseProxy;
