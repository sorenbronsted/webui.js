class InputCss {

	constructor() {
		this._cssError = "error";
		this._cssValid = "valid";
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

exports.InputCss = InputCss;