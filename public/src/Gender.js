const mvc = require('../../lib/src/mvc');

class Gender extends mvc.CrudProxy {
	constructor(store) {
		super(store);
	}
}
exports.Gender = Gender;