const InputCss = require('./InputCss.js').InputCss;

class InputCssUfds extends InputCss {

	constructor() {
		super();
		this._cssError = "has-error";
		this._cssValid = "has-success";
		this._cssHidden = "hidden";
	}

	clear(input) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssError);
		element.classList.remove(this._cssValid);
		input.title = '';
	}

	error(input, msg) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssValid);
		element.classList.add(this._cssError);
		input.title = msg;
	}

	valid(input) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssError);
		element.classList.add(this._cssValid);
		input.title = '';
	}

	hide(input) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.add(this._cssHidden);
	}

	show(input) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssHidden);
	}
}

exports.InputCssUfds = InputCssUfds;