const InputCss = require('./InputCss.js').InputCss;

/**
 * This class implements w3css css
 * @implements InputCss
 */
class InputCssW3 extends InputCss {
	constructor() {
		super();
		this._cssError = "w3-pale-red";
		this._cssWarning = "w3-pale-yellow";
		this._cssValid = "w3-border-green";
		this._cssHidden = "w3-hide";
		this._all = [this._cssError, this._cssWarning, this._cssValid];
	}

	clear(input) {
		this._all.forEach(item => {
			input.classList.remove(item);
		});
		input.title = "";
	}

	error(input, msg) {
		input.title = msg;
		input.classList.add(this._cssError);
	}

	warning(input, msg) {
		input.title = msg;
		input.classList.add(this._cssWarning);
	}

	valid(input) {
		input.title = '';
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