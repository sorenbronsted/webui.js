const AnchorCss = require('./AnchorCss.js').AnchorCss;

class AnchorCssBootStrap extends AnchorCss {

	setActive(element) {
		element.parent.style.active = 'active';
	}

	setNotActive(element) {
		element.parent.style.active ='';
	}
}

exports.AnchorCssBootStrap = AnchorCssBootStrap;
