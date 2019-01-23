class AnchorCssUfds  {

	setActive(element) {
		element.parentNode.classList.add('active');
	}

	setNotActive(element) {
		element.parentNode.classList.remove( 'active');
	}
}

exports.AnchorCssUfds = AnchorCssUfds;
