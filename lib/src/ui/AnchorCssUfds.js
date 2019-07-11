/**
 * Ufds anchor style interface implementation @see {@link AnchorCss}
 */
class AnchorCssUfds  {

	constructor() {
		this._cssHidden = "hidden";
	}

	setActive(element) {
		element.parentNode.classList.add('active');
	}

	setNotActive(element) {
		element.parentNode.classList.remove( 'active');
	}

	hide(element) {
		element.classList.add(this._cssHidden);
	}

	show(element) {
		element.classList.remove(this._cssHidden);
	}
}

exports.AnchorCssUfds = AnchorCssUfds;
