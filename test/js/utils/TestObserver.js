
const mvc = require('../../../lib/src/mvc');

class TestObserver extends mvc.Observer {
	constructor(repo) {
		super();

		let router = repo.get(mvc.Router.name);
		if (router != null) {
			router.addEventListener(this);
			this.addEventHandler(router.eventReadOk, this._collect);
		}

		let proxy = repo.get(mvc.CrudProxy.name);
		if (proxy != null) {
			proxy.addEventListener(this);
			this.addEventHandler(proxy.eventCreateOk, this._collect);
			this.addEventHandler(proxy.eventReadOk, this._collect);
			this.addEventHandler(proxy.eventReadFail, this._error);
			this.addEventHandler(proxy.eventUpdateOk, this._collect);
			this.addEventHandler(proxy.eventUpdateFail, this._error);
			this.addEventHandler(proxy.eventDeleteOk, this._collect);
			this.addEventHandler(proxy.eventDeleteFail, this._error);
		}
		this.reset();
	}

	_collect(sender, body) {
		this.sender = sender;
		this.body = body;
	}

	_error(sender, body) {
		this.sender = sender;
		this.error = body;
	}

	reset() {
		this.sender = null;
		this.body = null;
		this.error = null;
	}
}

exports.TestObserver = TestObserver;