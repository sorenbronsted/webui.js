const InputCss = require('./InputCss.js').InputCss;

class InputCssW3 extends InputCss {
	constructor() {
		super();
		this._cssError = "error";
		this._cssValid = "w3-border-green";
		this._cssHidden = "w3-hide";
	}

	clear(input) {
		input.classList.remove(this._cssValid);
		input.classList.remove(this._cssError);
		input.title = "";
	}

	error(input, msg) {
		input.title = msg;
		input.classList.add(this._cssError);
	}
	
	valid(input) {
		input.classList.add(this._cssValid);
	}
	
	hide(input) {
		input.classList.add(this._cssHidden);
		input.previousElementSibling.classList.add(this._cssHidden);
	}
	
	show(input) {
		input.classList.remove(this._cssHidden);
		input.previousElementSibling.classList.remove(this._cssHidden);
	}
}
exports.InputCssW3 = InputCssW3;