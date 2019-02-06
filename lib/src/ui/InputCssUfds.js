const InputCss = require('./InputCss.js').InputCss;


class InputCssUfds extends InputCss {

	constructor() {
		super();
		this._cssError = "has-error";
		this._cssValid = "has-success";
		this._cssHidden = "hidden";
	}

	clear(input) {
		if (typeof input === 'undefined') {
			return;
		}
		let elementID = input.id;

		if (elementID != null) {
			let label = document.querySelector(`[for="${elementID}"]`);

			if (label != null) {
				label.classList.remove(this._cssError);
				label.classList.remove(this._cssValid);
			}
		}

		input.classList.remove(this._cssError);
		input.classList.remove(this._cssValid);
		input.title = '';
	}

	error(input, msg) {
		if (typeof input === 'undefined') {
			return;
		}
		let elementID = input.id;

		if (elementID != null) {
			let label = document.querySelector(`[for="${elementID}"]`);

			if (label != null) {
				label.classList.add(this._cssError);
				label.classList.remove(this._cssValid);
			}
		}

		input.classList.add(this._cssError);
		input.classList.remove(this._cssValid);
		input.title = msg;
	}

	valid(input) {
		if (typeof input === 'undefined') {
			return;
		}
		let elementID = input.id;

		if (elementID != null) {
			let label = document.querySelector(`[for="${elementID}"]`);

			if (label != null) {
				label.classList.remove(this._cssError);
				label.classList.add(this._cssValid);
			}
		}

		input.classList.remove(this._cssError);
		input.classList.add(this._cssValid);
		input.title = '';
	}

	hide(input) {
		element.classList.add(this._cssHidden);
	}

	show(input) {
		element.classList.remove(this._cssHidden);
	}
}

exports.InputCssUfds = InputCssUfds;