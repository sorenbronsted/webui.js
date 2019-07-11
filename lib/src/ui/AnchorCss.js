/**
 * Anchor interface to css operations
 */
class AnchorCss {
	/**
	 * Set non active style
	 * @param {HTMLAnchorElement} element - the anchor element
	 */
	setNotActive(element) {
		element.style.active = '';
	}

	/**
	 * Set active style
	 * @param {HTMLAnchorElement} element - the anchor element
	 */
	setActive(element) {
		element.style.active = 'active';
	}

	/**
	 * Hide the anchor element
	 * @param {HTMLAnchorElement} element - the anchor element
	 */
	hide(element) {
		element.hidden = true;
	}

	/**
	 * Show the anchor element
	 * @param {HTMLAnchorElement} element - the anchor element
	 */
	show(element) {
		element.hidden = false;
	}
}
exports.AnchorCss = AnchorCss;
