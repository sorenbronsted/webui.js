const mvc = require('../../lib/src/mvc');

class PersonListCtrl extends mvc.ListController {
	constructor(model, view) {
		super('/list/person', model, view);
	}
}
exports.PersonListCtrl = PersonListCtrl;

class PersonDetailCtrl extends mvc.DetailController {
	constructor(model, view) {
		super('/detail/person', model, view);
	}
}
exports.PersonDetailCtrl = PersonDetailCtrl;

class Person extends mvc.CrudProxy {
	constructor(store) {
		super(store);
	}
}
exports.Person = Person;