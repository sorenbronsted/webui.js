
const mvc = require('../../../lib/src/mvc');

class TestObserver extends mvc.Observer {
	constructor(repo) {
		super();
		this.root = null;
		if (repo !== undefined) {
			repo.get(mvc.Router.name).addEventListener(this);
			repo.get(mvc.CrudProxy.name).addEventListener(this);
		}
	}

	handleEvent(event) {
		this.root = event;
	}
}
exports.TestObserver = TestObserver;