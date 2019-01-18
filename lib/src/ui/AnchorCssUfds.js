class AnchorCssUfds  {

	setActive(element) {
		element.parentNode.classList.add('active');
		console.log('added class active');
	}

	setNotActive(element) {
		element.parentNode.classList.remove( 'active');
		console.log('removed class active');
	}
}

exports.AnchorCssUfds = AnchorCssUfds;
