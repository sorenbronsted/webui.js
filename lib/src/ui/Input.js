const InputBase = require('./InputBase.js').InputBase;
const datepicker = require('./DatePicker.js');
const moment = require('moment');

class Input extends InputBase {

	constructor(view, input, parentCls) { 
		super(view, input, parentCls);
		switch(this._element.type.toLowerCase()) {
			case 'file':
				this._initFile();
				break;
			case 'checkbox':
				this._initCheckbox();
				break;
			case 'radio':
				this._initRadio();
				break;
			default:
				this._initInput();
		}
		this.resetUiState();
	}

	get value() {
		switch(this._element.type) {
			case 'file':
				return this._element.files;
			case 'checkbox':
				return this._element.checked ? 1 : 0;
			case 'radio':
				return this._element.checked ? this._element.value : '';
			default:
				return this._view._formatter.internal(this._type, this._element.value, this._format);
		}
	}

	populate(sender, data) {
		// If no data or wrong sender is considered an anomaly
		if (!data || this._class !== sender) {
			return;
		}

		if (!this._property in data) {
			return;
		}

		this._uid = data.uid;
		if (data[this._property] == null && this._element.type !== 'radio' && this._element.type !== 'checkbox') {
			this._element.value = '';
			return;
		}

		this.resetUiState();
		switch(this._element.type) {
			case 'file':
				break;
			case 'checkbox':
				this._element.checked = (1 === data[this._property]);
				break;
			case 'radio':
				this._element.checked = (this._element.value === data[this._property]);
				break;
			default:
				this._element.value = this._view.formatter.display(this._type, data[this._property], this.dataformat);
		}
		this._view._validator.reset(this);
	}

	_initInput() {

		if (this._element.getAttribute('data-type') === 'date') {
			let format = this._element.getAttribute('data-format');
			let dp     = new datepicker.DatePicker(this._element, format);
			dp.picker.on('select', (event => {
				this._element.focus();
			}));
		}

		this._element.onfocus = (event  => {
			this._view._validator.reset(this);
			this.isValid = true;
		});
	
		this._element.onkeypress = (event => {
			this.isDirty = true;
		});
	
		this._element.onblur = (event => {
			this.isValid = this._view._validator.validate(this);
			if (this.isValid) {
				this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
			}
		});
	
		this._element.onkeydown = (event => {
			if (event.keyCode === 13) {
				this.isValid = this._view._validator.validate(this);
				if (this.isValid) {
					this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
				}
			}
		});
	
		this._element.onchange = (event => {
			this.isDirty = true;
		});
	}

	_initRadio() {
		this._element.name = `${this._class}.${this._property}`; // name must set for radio button to work
		this._element.onchange = (event => {
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}

	_initCheckbox() {
		this._element.onchange = (event => {
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}

	_initFile() {
		this._element.onchange = (event => {
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}
}

exports.Input = Input;
