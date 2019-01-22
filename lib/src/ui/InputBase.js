const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class InputBase extends ElementWrapper {

	constructor(view, element, cls) {
		super(view, element, cls);
	}

	get isValid() {
		return this._view.isValid;
	}

	set isValid(state) {
		this._view.isValid = state;
	}

	get isDirty() {
		return this._view.isDirty;
	}

	set isDirty(state) {
		this._view.isDirty = state;
	}

	resetUiState() {
		this.isValid = true;
		this.isDirty = false;
	}

	validate() {
		this.isValid = this._view.validator.validate(this);
	}

	showError(error) {

		if (error.has(this._property)) {
			this._view.validator.css.clear(this._element);
			this._view.validator.css.error(this._element, error.get(this._property));
		}
	}
}

exports.InputBase = InputBase;