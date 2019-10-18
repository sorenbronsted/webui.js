
const collect = require('collect.js');
const URI = require('uri-js');
const Observer = require('./Observer.js').Observer;
const StateMachine = require('./StateMachine.js').StateMachine;
const Transition = require('./Transition.js').Transition;
const Router = require('./Router.js').Router;

class BaseController extends Observer {
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

	get state() {
		return this._sm.state;
	}

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

	addTransition(transition) {
		this._sm.add(transition);
	}

	handleEvent(event) {
		this._sm.run(event);
	}

	hasFailed(event) {
		try {
			let proxy = this.repo.get(event.sender);
			return event.name === proxy.eventFail;
		}
		catch(e) {
			return false;
		}
	}

	showError(exception) {
		this.view.alert(exception);
	}

	fail(event) {
		this.view.showErrors(event.body);
	}

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

	show(event) {
		let parsedUri = URI.parse(event.body);
		let pathSegments = parsedUri.path.split('/');

		let proxy = this.repo.get(pathSegments[2]);

		// display view
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

	canChange(event) {
		return event.name === this.view.eventPropertyChanged;
	}

	changed(event) {
		let proxy = this.repo.get(event.body.cls);
		proxy.setPropertyByElement(event.body);
	}

	canPopulate(event) {
		try {
			let proxy = this.repo.get(event.sender);
			return proxy.constructor.name !== Router.name && event.name === proxy.eventOk;
		}
		catch (e) {
			return false;
		}
	}

	populate(event) {
		this.view.populate(event.sender, event.body); //TODO convert to only event
	}

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

	stop(event) {
		// Do nothing
	}
}
exports.BaseController = BaseController;