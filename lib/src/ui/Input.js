const InputBase = require('./InputBase.js').InputBase;

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
				return this._element.checked ? this._element.value : '';
			case 'radio':
				return this._element.checked ? this._element.value : '0';
			default:
				return this._view._formatter.internal(this._type, this._element.value, this._format);
		}
		return '';
	}

	populate(sender, data) {
		if (this._class !== sender) {
			return;
		}
		this._uid = data.uid;
		if (data[this._property] === undefined) {
			data[this._property] = '';
		}

		this.resetUiState();
		switch(this._element.type) {
			case 'file':
				break;
			case 'checkbox':
				this._element.checked = (this._element.value == data[this._property]);
				break;
			case 'radio':
				this._element.checked = (this._element.value == data[this._property]);
				break;
			default:
				this._element.value = this._view.formatter.display(this._type, data[this._property], this.dataformat);
		}
		this._view._validator.reset(this);
	}

	_initInput() {

		this._element.onfocus = (event  => {
			this._view._validator.reset(this);
			this.isValid = true;
		});
	
		this._element.onkeypress = (event => {
			this.isDirty = true;
		});
	
		this._element.onblur = (event => {
			event.preventDefault();
			this.isValid = this._view._validator.validate(this);
			if (this.isValid) {
				this._view.validateAndfire(this._view.eventPropertyChanged, true, this.elementValue);
			}
		});
	
		this._element.onkeydown = (event => {
			if (event.keyCode === 13) {
				this._view.validateAndfire(this._view.eventPropertyChanged, true, this.elementValue);
			}
		});
	
		this._element.onchange = (event => {
			event.preventDefault();
			this.isDirty = true;
		});
	}

	_initRadio() {
		// this._element.name = `${this._class}.${this._property}`; // name must set for radio button to work
		// console.log(this._element.name);
		this._element.onchange = (event => {
			event.preventDefault();
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}

	_initCheckbox() {
		this._element.onchange = (event => {
			event.preventDefault();
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}

	_initFile() {
		this._element.onchange = (event => {
			event.preventDefault();
			this.isDirty = true;
			this._view.validateAndfire(this._view.eventPropertyChanged, false, this.elementValue);
		});
	}
}

exports.Input = Input;
