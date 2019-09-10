const AnchorCss = require('./AnchorCss.js').AnchorCss;

class AnchorCssBootStrap extends AnchorCss {

	constructor() {
		super();
		this._cssHidden = "hidden";
	}

	select(element) {
		element.parent.style.active = 'active';
	}

	deselect(element) {
		element.parent.style.active ='';
	}

	hide(input) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.add(this._cssHidden);
	}

	show(input) {
		let element = input.parentNode;
		if (element == null) {
			element = input;
		}
		element.classList.remove(this._cssHidden);
	}
}

exports.AnchorCssBootStrap = AnchorCssBootStrap;
