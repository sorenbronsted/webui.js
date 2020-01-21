/**
 * @file
 * @todo state diagram
 */
const collect = require('collect.js');
const URI = require('uri-js');
const Observer = require('./Observer.js').Observer;
const StateMachine = require('./StateMachine.js').StateMachine;
const Transition = require('./Transition.js').Transition;
const Router = require('./Router.js').Router;
const CurrentViewState = require('./CurrentViewState.js').CurrentViewState;

/**
 * This class provide some basic logic for a controller. It hold a statemachine and it is configured to the following
 * behaviour.
 * <img src="mvc/BaseControllerState.png">
 */
class BaseController extends Observer {
	/**
	 * @param {string} activationUri
	 * 	The url which determines when it should be active.
	 * @param {Repo} repo
	 * 	The repo of proxy objects
	 * @param {View} view
	 * 	The view to talk to.
	 */
	constructor(activationUri, repo, view) {
		super();
		this._sm = new StateMachine(this);
		this.activationUri = activationUri;
		this.repo = repo;
		this.view = view;
		this.states = {};

		this.populateStateMachine();

		this.view.addEventListener(this);

		let classes = this.view.classes.merge(this.view.dataLists.all());
		classes.put(Router.name, Router.name); // Set behavior

		classes.values().each(cls => {
			let proxy = this.repo.get(cls);
			proxy.addEventListener(this);
		});
	}

	/**
	 * Gets current state
	 * @returns {string}
	 * 	The state
	 */
	get state() {
		return this._sm.state;
	}

	/**
	 * Populate the statemachine with transitions according to state diagram
	 */
	populateStateMachine() {
		this.states.start =	'start';
		this.states.input =	'input';

		// Start
		this.addTransition(new Transition(this.states.start, this.states.input, this.show, this.canShow));
		// Input
		this.addTransition(new Transition(this.states.input, this.states.input, this.changed, this.canChange));
		this.addTransition(new Transition(this.states.input, this.states.input, this.populate, this.canPopulate));
		this.addTransition(new Transition(this.states.input, this.states.input, this.fail, this.hasFailed));
		this.addTransition(new Transition(this.states.input, this.states.start, this.stop, this.canStop));
	}

	/**
	 * Add a transtion
	 * @param {Transtion} transition
	 * 	The transition
	 */
	addTransition(transition) {
		this._sm.add(transition);
	}

	/**
	 * Handle the event by running the statemachine
	 * @param {Event} event
	 * 	The event
	 */
	handleEvent(event) {
		this._sm.run(event);
	}

	/**
	 * Tells if the event is a fail event or not
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when failed other false
	 */
	hasFailed(event) {
		try {
			let proxy = this.repo.get(event.sender);
			return event.name === proxy.eventFail;
		}
		catch(e) {
			return false;
		}
	}

	/**
	 * Show the error
	 * @param {Event} event
	 * 	The event
	 */
	fail(event) {
		this.view.showErrors(event.body);
	}

	/**
	 * Tells if the event is from router and the given url == this.activationUrl
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true on match otherwise false
	 */
	canShow(event) {
		if (event.sender !== Router.name) {
			return false;
		}
		let pathSegments = URI.parse(event.body).path.split('/');
		if (pathSegments.length < 3) {
			return false;
		}
		return pathSegments.slice(0, 3).join('/').toLowerCase() === this.activationUri.toLowerCase();
	}

	/**
	 * Show the view and request data from the proxies which are used in the view
	 * @param {Event} event
	 * 	The event
	 */
	show(event) {
		let parsedUri = URI.parse(event.body);
		let pathSegments = parsedUri.path.split('/');

		let proxy = this.repo.get(pathSegments[2]);

		// display view
		this.repo.get(CurrentViewState.name).reset();
		this.view.show();

		// read datalist which are M-1 relations to proxy
		this.view.dataLists.each(name => {
			let proxy = this.repo.get(name);
			proxy.read();
		});

		if (parsedUri.query !== undefined) {
			parsedUri.query.split('&').forEach(elem => {
				let parts = elem.split('=');
				let name = parts[0];
				proxy.setProperty(name, isNaN(parts[1]) ? parts[1] : parseInt(parts[1]));
			});
		}
		if (pathSegments.length === 3) { // eg /list/customer
			proxy.read();
		}
		else {
			let lastSegment = pathSegments[pathSegments.length - 1];
			if (lastSegment === 'new' || lastSegment === '0') {
				proxy.create();
			}
			else {
				let uid = parseInt(lastSegment);
				// read other data-class with relation 1-M to this proxy
				this.view.classes.each(name => {
					if (name === proxy.cls) {
						proxy.read(uid);
					}
					else {
						let foreignKey = proxy.cls.toLowerCase() + '_uid';
						let related = this.repo.get(name);
						related.setProperty(foreignKey, uid);
						related.read();
					}
				});
			}
		}
	}

	/**
	 * Tells if the event is a property change from the view.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true on match otherwise false
	 */
	canChange(event) {
		return event.name === this.view.eventPropertyChanged;
	}

	changed(event) {
		let proxy = this.repo.get(event.body.cls);
		proxy.setPropertyByElement(event.body);
	}

	/**
	 * Tells if the event is from a proxy.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true on match otherwise false
	 */
	canPopulate(event) {
		try {
			let proxy = this.repo.get(event.sender);
			return proxy.constructor.name !== Router.name && event.name === proxy.eventOk;
		}
		catch (e) {
			return false;
		}
	}

	/**
	 * Populate the view with data from a proxy
	 * @param {Event} event
	 * 	The event
	 */
	populate(event) {
		this.view.populate(event.sender, event.body); //TODO convert to only event
	}

	/**
	 * Tells if the event is from router and the given url =! this.activationUrl
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true on match otherwise false
	 */
	canStop(event) {
		if (event.sender !== Router.name) {
			return false;
		}
		let pathSegments = URI.parse(event.body).path.split('/');
		if (pathSegments.length < 3) {
			return false;
		}
		return pathSegments.slice(0, 3).join('/').toLowerCase() !== this.activationUri.toLowerCase();
	}

	/**
	 * Stop this controller.
	 * @param {Event} event
	 * 	The event
	 */
	stop(event) {
		// Do nothing
	}
}
exports.BaseController = BaseController;