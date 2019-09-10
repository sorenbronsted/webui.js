/**
 * Ufds anchor style interface implementation @see {@link AnchorCss}
 */
class AnchorCssUfds  {

	constructor() {
		this._cssHidden = "hidden";
	}

	select(element) {
		element.parentNode.classList.add('selected');
	}

	deselect(element) {
		element.parentNode.classList.remove( 'selected');
	}

	hide(element) {
		element.classList.add(this._cssHidden);
	}

	show(element) {
		element.classList.remove(this._cssHidden);
	}
}

exports.AnchorCssUfds = AnchorCssUfds;
