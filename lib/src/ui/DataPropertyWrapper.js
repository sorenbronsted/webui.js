const ContainerWrapper = require('./ContainerWrapper.js').ContainerWrapper;

class DataPropertyWrapper extends ContainerWrapper {
	constructor(view, root, parentClass, factory) {
		super(view, root, parentClass);
		root.querySelectorAll('[data-property], button').forEach(element => {
			let elementWrapper = factory.make(view, element, this._class);
			this._elements.push(elementWrapper);
		});
	}

	populate(sender, data) {
		this._elements.each(elem => {
			elem.populate(sender, data);
		});
	}
}

exports.DataPropertyWrapper = DataPropertyWrapper;
