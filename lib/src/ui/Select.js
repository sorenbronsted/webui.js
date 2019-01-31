const collect = require('collect.js');
const InputBase = require('./InputBase.js').InputBase;

class Select extends InputBase {

	constructor(view, select, cls) {
		super(view, select, cls);

		this._options = this.getAttribute('data-list');
		this._optionProperty = this.getAttribute('data-list-display');
		//This shadows the value property, so that value can be set before any options are available
		this._myvalue = '';
		this._choice = this.getAttribute('data-choice');

		if (this._options !== undefined && this._options !== ''
				&& this._optionProperty !== null && this._optionProperty === '') {
			throw new Error("options is used so option-display is needed");
		}

		this._element.onfocus = (event  => {
			this._view._validator.reset(this);
			this.isValid = true;
		});

		this._element.onchange = (event => {
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}

	set list(list) {
		if (this._options === null) {
			throw "options are not defined, so can not be set";
		}

		this._element.innerText = null;
		if (list === undefined || list.isEmpty()) {
			return;
		}

		let options = this._view.window.document.createDocumentFragment();

		let option = this._view.window.document.createElement('option');

		option.value = '';
		option.text = (this._choice == null ? '--' : this._choice);
		options.append(option);

		list.each(row => {
			let option = this._view.window.document.createElement('option');
			option.value = `${row.uid}`;
			option.text = row[this._optionProperty];
			options.append(option);
		});

		this._element.append(options);
		this._element.value = this._myvalue;
	}

	get value() {
		return this._element.value;
	}

	populate(sender, data) {
		if (this._class === sender) {
			this._uid = data.uid;
			if (data[this._property] === undefined) {
				return;
			}
			this._myvalue = `${data[this._property]}`;
			this._view.validator.reset(this);
		}
		else if (this._options === sender) {
			if (data === undefined) {
				return;
			}
			this.list = data;
		}
		this._element.value = this._myvalue;
		this._element.selectedIndex = this._element.selectedIndex === -1 ? 0 : this._element.selectedIndex;
	}

	collectDataLists(result) {
		if (this._options !== null) {
			result.put(this._options, this._options);
		}
		return result;
	}

}

exports.Select = Select;
