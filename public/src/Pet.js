const mvc = require('../../lib/src/mvc');

class Pet extends mvc.CrudProxy {
	constructor(store) {
		super(store);
		this.person_uid = null;
	}
}
exports.Pet = Pet;