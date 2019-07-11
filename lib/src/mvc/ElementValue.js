'use strict';

class ElementValue {
	constructor(cls, property, uid, value) {
		this.cls = cls;
		this.property = property;
		this.uid = uid;
		this.value = value;
	}

	toString() {
		return JSON.stringify(this);
	}
}
exports.ElementValue = ElementValue;
