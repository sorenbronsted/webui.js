/**
 * w3css anchor style interface implementation @see {@link AnchorCss}
 */
class AnchorCssW3  {

	constructor() {
		this._cssHidden = "w3-hide";
	}

	select(element) {
		if (element.classList.contains('topbar')) {
			element.classList.add('w3-light-blue');
		}
		else {
			element.classList.remove('w3-border-light-blue');
			element.classList.add('w3-border-purple');
		}
	}

	deselect(element) {
		if (element.classList.contains('topbar')) {
			element.classList.remove('w3-light-blue');
		}
		else {
			element.classList.remove('w3-border-purple');
			element.classList.add('w3-border-light-blue');
		}
	}

	hide(element) {
		if (element.classList.contains('topbar')) {
			return;
		}
		element.classList.add(this._cssHidden);
	}

	show(element) {
		if (element.classList.contains('topbar')) {
			return;
		}
		element.classList.remove(this._cssHidden);
	}
}
exports.AnchorCssW3 = AnchorCssW3;
