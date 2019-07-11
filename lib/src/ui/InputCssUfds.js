const InputCss = require('./InputCss.js').InputCss;


class InputCssUfds extends InputCss {

	constructor() {
		super();
		this._cssError = "has-error";
		this._cssValid = "has-success";
		this._cssHidden = "hidden";
	}

	clear(input) {
		if (input == null) {
			return;
		}
		let label = this._getLabel(input);
		if (label != null) {
			label.classList.remove(this._cssError);
			label.classList.remove(this._cssValid);
		}

		input.classList.remove(this._cssError);
		input.classList.remove(this._cssValid);
		input.title = '';
		this.show(input);
	}

	error(input, msg) {
		if (input == null) {
			return;
		}
		let label = this._getLabel(input);
		if (label != null) {
			label.classList.add(this._cssError);
			label.classList.remove(this._cssValid);
		}

		input.classList.add(this._cssError);
		input.classList.remove(this._cssValid);
		input.title = msg;
	}

	valid(input) {
		if (input == null) {
			return;
		}
		let label = this._getLabel(input);
		if (label != null) {
			label.classList.remove(this._cssError);
			label.classList.add(this._cssValid);
		}

		input.classList.remove(this._cssError);
		input.classList.add(this._cssValid);
		input.title = '';
	}

	hide(input) {
		let label = this._getLabel(input);
		if (label != null) {
			label.classList.add(this._cssHidden);
		}
		input.classList.add(this._cssHidden);
		var br = input.nextElementSibling;
		if (br != null && br.tagName === 'BR') {
			br.classList.add(this._cssHidden);
		}
	}

	show(input) {
		let label = this._getLabel(input);
		if (label != null) {
			label.classList.remove(this._cssHidden);
		}
		input.classList.remove(this._cssHidden);
		var br = input.nextElementSibling;
		if (br != null && br.tagName === 'BR') {
			br.classList.remove(this._cssHidden);
		}
	}

	_getLabel(input) {
		let elementID = input.id;
		if (elementID == null) {
			return null;
		}
		return document.querySelector(`[for="${elementID}"]`);
	}
}

exports.InputCssUfds = InputCssUfds;