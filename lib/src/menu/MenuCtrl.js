
const Router = require('../mvc/Router.js').Router;
const Observer = require('../mvc/Observer.js').Observer;
const View = require('../ui/View.js').View;

class MenuCtrl extends Observer {

	constructor(router, proxy, view) {
		super();
		this._router = router;
		this._proxy = proxy;
		this._view = view;

		this._router.addEventListener(this);
		this._proxy.addEventListener(this);
		this._view.addEventListener(this);
	}

	handleEvent(event) {
		if (event.sender === Router.name) {
			this._show(event);
		}
		else if (event.sender === this._proxy.constructor.name) {
			this._view.populate(event.sender, event.body);
		}
		else if (event.sender === View.name && event.name === this._view.eventClick) {
			let router = this._repo.get(Router.name);
			router.goto(event.body.value);
		}
	}

	_show(event) {
		// Every change from the router pass through here
		if (!this._view.isVisible) {
			// The first time show the menu and select uid == 1
			this._view.show();
		}
		this._proxy.setParameter(event.body);
		// select corresponding menuProxy
		this._proxy.select(event.body);
		// populate current state of the tabs
		this._proxy.populate();
	}
}
exports.MenuCtrl = MenuCtrl;
