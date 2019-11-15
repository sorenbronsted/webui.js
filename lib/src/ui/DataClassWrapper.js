const ContainerWrapper = require('./ContainerWrapper.js').ContainerWrapper;

class DataClassWrapper extends ContainerWrapper {
	constructor(view, root, parentClass, factory) {
		super(view, root, parentClass);
		//root.querySelectorAll('form[data-class], table[data-class], div[data-class], fieldset[data-class], ' +
		//		'section[data-class], nav[data-class], button[data-class], ul[data-class], a[data-class]').forEach(elem => {
		root.querySelectorAll('[data-class]').forEach(elem => {
			let elementWrapper = factory.make(view, elem, parentClass);
			this._elements.push(elementWrapper);
		});
	}
}
exports.DataClassWrapper = DataClassWrapper;
