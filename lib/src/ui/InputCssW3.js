
const InputCss = require('./InputCss.js').InputCss;

class InputCssW3 extends InputCss {
	constructor() {
		super();
		this._cssError = "w3-border-red";
		this._cssValid = "w3-border-green";
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
		input.hidden = true;
	}
	
	show(input) {
		input.hidden = false;
	}
}

exports.InputCssW3 = InputCssW3;