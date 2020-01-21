/**
 * The default View interface to css operations
 * @implements ViewCss
 */
class ViewCssW3 {
	/**
	 * This will set the hidden attribute to true
	 * @param {HTMLDivElement} element
	 * 	The element
	 */
	hide(element) {
		element.classList.add('w3-hide');
	}

	/**
	 * This will set the hidden attribute to false
	 * @param {HTMLDivElement} element
	 * 	The element
	 */
	show(element) {
		element.classList.remove('w3-hide');
	}
}
exports.ViewCssW3 = ViewCssW3;