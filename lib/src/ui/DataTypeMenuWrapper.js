const ContainerWrapper = require('./ContainerWrapper.js').ContainerWrapper;

/**
 * This is a class to wrap anchor element with data-type menu
 */
class DataTypeMenuWrapper extends ContainerWrapper {
	/**
	 * The constructor
	 * @param {View} view - The view class
	 * @param {DocumentFragment} root - This view html fragment
	 * @param {string} parentClass - Class name from parent element
	 * @param {ElementFactory} factory - The factory for creating elements
	 */
	constructor(view, root, parentClass, factory) {
		super(view, root, parentClass);
		root.querySelectorAll('a[data-type=menu]').forEach(element => {
			let elementWrapper = factory.make(view, element, this._class);
			this._elements.push(elementWrapper);
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
exports.DataTypeMenuWrapper = DataTypeMenuWrapper;
