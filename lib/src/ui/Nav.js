const collect = require('collect.js');
const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;
const Anchor = require('./Anchor.js').Anchor;

/**
 * This is a class to wrap anchor element with data-type menu
 */
class Nav extends ElementWrapper {
	/**
	 * The constructor
	 * @param {View} view - The view class
	 * @param {Nav} nav - This view html fragment
	 * @param {string} parentClass - Class name from parent element
	 * @param {ElementFactory} factory - The factory for creating elements
	 */
	constructor(view, nav) {
		super(view, nav);
		this._elements = collect([]);
		nav.querySelectorAll('a[data-type=menu]').forEach(element => {
			let anchor = new Anchor(view, element);
			this._elements.push(anchor);
		});
	}

	/**
	 * Populate the elements
	 * @param {string} sender - The name of the sender
	 * @param {Object} root - An object with method getByUid which returns and object
	 */
	populate(sender, root) {
		if (root.getByUid == null) {
			return;
		}
		this._elements.each(elem => {
			let data = root.getByUid(elem.uid);
			elem.populate(sender, data);
		});
	}
}
exports.Nav = Nav;
