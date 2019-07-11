'use strict';

const collect = require('collect.js');
const Subject = require('./Subject.js').Subject;

class BaseProxy extends Subject {
	constructor() {
		super();
		this._objects = collect({});
		this.cls = this.constructor.name;
		this.sortBy = 'uid';
	}

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
	}

	addAll(rows, cls) {
		this.clear();
		rows.each(row => {
			this.add(row, cls);
		});
	}

	remove(uid) {
		this._objects.forget(uid);
	}

	get(uid) {
		return this._objects.get(uid);
	}

	has(uid) {
		return this._objects.has(uid);
	}

	getAll() {
		let result = Object.assign({}, this.filterBy);
		result['objects'] = this._objects.values().sortBy(this.sortBy);
		return result;
	}

	size() {
		return this._objects.count();
	}

	setProperty(name, value) {
		if (name in this) {
			this[name] = value;
		}
		else {
			throw Error('Property not found: '+name);
		}
	}

	setPropertyByElement(element) {
		if (element.property+'ByElement' in this) {
			this[element.property+'ByElement'] = element;
		}
		else if (element.property in this) {
			this[element.property] = element.value;
		}
		else if (!isNaN(element.uid)) {
			let object = this._objects.get(element.uid);
			object[element.property] = element.value;
		}
		else {
			throw Error('Property not found: '+element.property);
		}
	}

	get filterBy() {
		return {};
	}

	clear() {
		this._objects = collect({});
	}
}
exports.BaseProxy = BaseProxy;
