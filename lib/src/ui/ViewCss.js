/**
 * The default View interface to css operations
 */
class ViewCss {
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
exports.ViewCss = ViewCss;