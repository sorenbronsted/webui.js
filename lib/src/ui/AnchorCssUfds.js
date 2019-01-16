const AnchorCss = require('./AnchorCss.js').AnchorCss;

class AnchorCssUfds extends AnchorCss {

	setActive(element) {
		element.classList.add('active');
		console.log('added class active');
	}

	setNotActive(element) {
		element.classList.remove( 'active');
		console.log('removed class active');
	}
}

exports.AnchorCssUfds = AnchorCssUfds;
