const collect = require('collect.js');
const Subject = require('./Subject.js').Subject;

class BaseProxy extends Subject {
	constructor() {
		super();
		this._objects = collect({});
		this.cls = this.constructor.name;
	}

	add(object) {
		if (object[this.cls] === undefined) {
			throw new Error("This proxy and object are not of same class");
		}
		if (object[this.cls].uid === undefined) {
			throw new Error("Object must have an uid");
		}
		this._objects.put(object[this.cls].uid, object[this.cls]);
	}

	addAll(rows) {
		this._objects = collect({});
		rows.each(row => {
			this.add(row);
		});
	}

	remove(uid) {
		this._objects.forget(uid);
	}

	get(uid) {
		return this._objects.get(uid);
	}

	getAll() {
		return this._objects.values();
	}

	size() {
		return this._objects.count();
	}

	setProperty(element) {
		let object = this._objects.get(element.uid);
		object[element.property] = element.value;
	}
}

exports.BaseProxy = BaseProxy;