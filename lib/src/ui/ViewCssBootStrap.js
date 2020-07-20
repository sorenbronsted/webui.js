/**
 * The default View interface to css operations
 * @implements ViewCss
 */
class ViewCssBootStrap {
	/**
	 * This will set the hidden attribute to true
	 * @param {HTMLDivElement} element
	 * 	The element
	 */
	hide(element) {
		element.classList.add('d-none');
	}

	/**
	 * This will set the hidden attribute to false
	 * @param {HTMLDivElement} element
	 * 	The element
	 */
	show(element) {
		element.classList.remove('d-none');
	}
}
exports.ViewCssBootStrap = ViewCssBootStrap;