const InputBase = require('./InputBase.js').InputBase;

class TextArea extends InputBase {

	constructor(view, input, cls) {
		super(view, input, cls);
		this._element.onblur = (event => {
			event.preventDefault();
			this.isDirty = true;
			this.isValid = this._view._validator.validate(this);
			this._view.validateAndfire(this._view.eventPropertyChanged, true, this.elementValue);
		});

		this._element.onfocus = (event => {
			this._view._validator.reset(this);
			this.isValid = true;
		});

		this._element.onkeypress = (event => {
			this.isDirty = true;
		});
		this.resetUiState();
	}

	get value() {
		return this._view.formatter.internal(this._type, this._element.value, this._format);
	}

	populate(sender, value) {
		if (this._class !== sender) {
			return;
		}

		this._uid = value.uid;
		if (value[this._property] === undefined) {
			value[this._property] = '';
		}
		this.resetUiState();
		this._element.value = this._view.formatter.display(this._type, value[this._property], "");
		this._view._validator.reset(this);
	}
}

exports.TextArea = TextArea;