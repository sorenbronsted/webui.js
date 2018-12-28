const AnchorCss = require('./AnchorCss.js').AnchorCss;

class AnchorCssUfds extends AnchorCss {

	setActive(element) {
		element.parent.style.active = 'active';
	}

	setNotActive(element) {
		element.parent.style.active ='';
	}
}

exports.AnchorCssUfds = AnchorCssUfds;
