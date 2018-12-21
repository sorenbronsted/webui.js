
const collect = require('collect.js');
const ElementValue = require('../mvc/ElementValue.js').ElementValue;

class ElementWrapper {

	constructor(view, element, parentClass) {
		this._view = view;
		this._element = element;
		this._uid = parseInt(this.getAttribute('data-uid'));
		this._class = this.getAttribute('data-class');
		if (this._class === null) {
			this._class = parentClass;
		}
		this._property = this.getAttribute('data-property');
		this._type = this.getAttribute('data-type');
		this._format = this.getAttribute('data-format');
	}

	getAttribute(name) {
		return this._element.attributes.getNamedItem(name) !== null ? this._element.attributes.getNamedItem(name).value : null;
	}

	get elementValue() {
		return new ElementValue(this._class, this._property, this.uid, this.value);
	}

	get uid() {
		return this._uid;
	}

	get isDirty() {
		return false;
	}

	get isValid() {
		return true;
	}

	get value() {
		return null;
	}

	set uid(uid) {
		this._uid = uid;
	}

	populate(sender, object) {}

	showError(namedErrors) {}

	collectClasses(result) {
		if (this._class != null) {
			result.put(this._class, this._class);
		}
		return result;
	}

	collectDataLists(result) {
		return result;
	}
}

exports.ElementWrapper = ElementWrapper;