/**
 * The default InputElement interface to css operations
 */
class InputCss {

	constructor() {
		this._cssError = "error";
		this._cssWarning = "warning";
		this._cssValid = "valid";
		this._all = [this._cssError, this._cssWarning, this._cssValid];
	}

	/**
	 * This clear the element for this class css values
	 * @param {HTMLInputElement} input
	 * 	The input element
	 */
	clear(input) {
		this._all.forEach(item => {
			input.classList.remove(item);
		});
		input.title = "";
	}

	/**
	 * This will add a error class and set the title to message
	 * @param {HTMLInputElement} input
	 * 	The input element
	 * @param {string} msg
	 * 	The message
	 */
	error(input, msg) {
		input.title = msg;
		input.classList.add(this._cssError);
	}

	/**
	 * This will add a warning class and set the title to message
	 * @param {HTMLInputElement} input
	 * 	The input element
	 * @param {string} msg
	 * 	The message
	 */
	warning(input, msg) {
		input.title = msg;
		input.classList.add(this._cssWarning);
	}

	/**
	 * This will add a valide class and clear the title
	 * @param {HTMLInputElement} input
	 * 	The input element
	 * @param {string} msg
	 * 	The message
	 */
	valid(input) {
		input.title = "";
		input.classList.add(this._cssValid);
	}

	/**
	 * This will set the hidden attribute to true
	 * @param {HTMLInputElement} input
	 * 	The element
	 */
	hide(input) {
		input.hidden = true;
	}

	/**
	 * This will set the hidden attribute to false
	 * @param {HTMLInputElement} input
	 * 	The element
	 */
	show(input) {
		input.hidden = false;
	}
}
exports.InputCss = InputCss;