
const InputCss = require('./InputCss.js').InputCss;

class InputCssBootStrap extends InputCss {

	constructor() {
		super();
		this._cssError = "has-error";
		this._cssValid = "has-success";
		this._cssHidden = "hidden";
	}

	clear(input) {
		var element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssError);
		element.classList.remove(this._cssValid);
		input.title = '';
	}

	error(input, msg) {
	var element = input.parentNode;
	if (element == null) {
		element = input;
	}
	element.classList.remove(this._cssValid);
	element.classList.add(this._cssError);
	input.title = msg;
}

	valid(input) {
		var element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssError);
		element.classList.add(this._cssValid);
		input.title = '';
	}

	hide(input) {
		var element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.add(this._cssHidden);
	}

	show(input) {
		var element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssHidden);
	}
}

exports.InputCssBootStrap = InputCssBootStrap;