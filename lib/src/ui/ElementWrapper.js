const ElementValue = require('../mvc/ElementValue.js').ElementValue;

class ElementWrapper {

	constructor(view, element) {
		this._view = view;
		this._element = element;
		this._uid = parseInt(this.getAttribute('data-uid'));
		this._class = this.getAttribute('data-class');
		if (this._class === null) {
			this._class = this.parentDataClass;
			if (this._class === null) {
				throw Error('No data-class attribute found for element '+this._element.valueOf());
			}
		}
		this._property = this.getAttribute('data-property');
		this._type = this.getAttribute('data-type');
		this._format = this.getAttribute('data-format');
	}

	getAttribute(name) {
		return this._getAttribute(this._element, name);
	}

	_getAttribute(element, name) {
		let item = element.attributes.getNamedItem(name);
		return item !== null && item !== undefined && item !== '' ? item.value : null;
	}

	get parentDataClass() {
		let parent = this._element.parentElement;
		let dataClass = null;
		while (parent !== null && dataClass === null) {
			dataClass = this._getAttribute(parent, 'data-class');
			if (dataClass === null) {
				parent = parent.parentElement;
			}
		}
		return dataClass;
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

	get dataformat() {
		return this._format;
	}

	get datatype() {
		return this._type;
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
