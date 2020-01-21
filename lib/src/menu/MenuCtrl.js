const Router = require('../mvc/Router.js').Router;
const Observer = require('../mvc/Observer.js').Observer;
const CurrentViewState = require('../mvc/CurrentViewState.js').CurrentViewState;

/**
 * The MenuCtrl controls a view and a model MenuProxy. It is always active and it reacts to events from its subjects.
 */
class MenuCtrl extends Observer {

	/**
	 * The constructor which adds it self as listener to the provided subjects.
	 * @param {Router} router
	 * 	The router subject
	 * @param {MenuProxy} proxy
	 * 	The menuproxy subject
	 * @param {View} view
	 * 	The view subject
	 * @param {CurrentViewState} currentViewState
	 * 	The current view state subject
	 */
	constructor(router, proxy, view, currentViewState) {
		super();
		this._router = router;
		this._proxy = proxy;
		this._view = view;
		this._currentViewState = currentViewState;

		this._router.addEventListener(this);
		this._proxy.addEventListener(this);
		this._view.addEventListener(this);
	}

	/**
	 *  Handle and incoming event
	 * @param {Event} event
	 * 	The incoming event
	 */
	handleEvent(event) {
		if (event.sender === Router.name) {
			this._show(event);
		}
		else if (event.sender === this._proxy.constructor.name) {
			this._view.populate(event.sender, event.body);
		}
		else if (event.sender === this._view.constructor.name && event.name === this._view.eventClick) {
			if (this._currentViewState.isDirty && !this._view.confirm("Dine ændringer er ved at gå tabt. Vil du fortsætte?")) {
				return;
			}
			this._router.goto(event.body.value);
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
