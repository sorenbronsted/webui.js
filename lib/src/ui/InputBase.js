const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class InputBase extends ElementWrapper {

	constructor(view, element) {
		super(view, element);
		this.resetUiState();
	}

	get isValid() {
		return this._isValid;
	}

	set isValid(state) {
		this._isValid = state;
	}

	set isDirty(state) {
		this._view.isDirty = state;
	}

	resetUiState() {
		this.isValid = true;
	}

	validate() {
		this.isValid = this._view.validator.validate(this);
	}

	showError(error) {
		let validation = error.first(item => {
			return this._class === item.class && this._property === item.property;
		});
		if (validation == null) {
			return;
		}
		this._view.validator.css.clear(this._element);
		if (validation.type === 'error') {
			this._view.validator.css.error(this._element, validation.msg);
			this.isValid = false;
		}
		else if (validation.type === 'warning') {
			this._view.validator.css.warning(this._element, validation.msg);
		}
	}
}
exports.InputBase = InputBase;