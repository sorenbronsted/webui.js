const collect = require('collect.js');
const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class ContainerWrapper extends ElementWrapper {

	constructor(view, root, parentClass) {
		super(view, root, parentClass);
		this._elements = collect([]);
	}

	populate(sender, object) {
		this._elements.each(elem => elem.populate(sender, object));
	}

	get isDirty() {
		return this._elements.first(input => input.isDirty) != null;
	}

	get isValid() {
		return this._elements.first(input => !input.isValid) != null;
	}

	collectClasses(result) {
		this._elements.each(elem => elem.collectClasses(result));
		return result;
	}

	collectDataLists(result) {
		this._elements.each(elem => elem.collectDataLists(result));
		return result;
	}

	showError(namedErrors) {
		this._elements.each(elem => elem.showError(namedErrors));
	}
}
exports.ContainerWrapper = ContainerWrapper;
