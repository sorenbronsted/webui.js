'use strict';

const collect = require('collect.js');
const BaseController = require('./BaseController.js').BaseController;
const Router = require('./Router.js').Router;
const Transition = require('./Transition.js').Transition;

class ListController extends BaseController {

	constructor(activationUri, repo, view) {
		super(activationUri, repo, view);
	}

	populateStateMachine() {
		super.populateStateMachine();

		this.states.find = 'find';
		this.states.delete = 'delete';
		this.states.create = 'create';

		// Start to Input is handled in super
		// Input
		this.addTransition(new Transition(this.states.input, this.states.find, this.find, this.canFind));
		this.addTransition(new Transition(this.states.input, this.states.delete, this.delete, this.canDelete));
		this.addTransition(new Transition(this.states.input, this.states.start, this.create, this.canCreate));
		this.addTransition(new Transition(this.states.input, this.states.start, this.edit, this.canEdit));
		this.addTransition(new Transition(this.states.input, this.states.start, this.children, this.canChildren));
		this.addTransition(new Transition(this.states.input, this.states.start, this.back, this.canBack));
		// Find
		this.addTransition(new Transition(this.states.find, this.states.input, this.populate, this.canPopulate));
		this.addTransition(new Transition(this.states.find, this.states.input, this.fail, this.hasFailed));
		// Delete
		this.addTransition(new Transition(this.states.delete, this.states.find, this.find, this.canFind));
		this.addTransition(new Transition(this.states.delete, this.states.input, this.fail, this.hasFailed));
	}

	canEdit(event) {
		return event.name === 'edit';
	}

	edit(event) {
		this.repo.get(Router.name).goto(`/detail/${event.body.cls}/${event.body.uid}`);
	}

	canCreate(event) {
		return event.name === 'create';
	}

	create(event) {
		this.repo.get(Router.name).goto(`/detail/${event.body.cls}/new`);
	}

	canChildren(event) {
		return event.name === 'children';
	}

	children(event) {
		this.repo.get(Router.name).goto(event.body.value);
	}

	canBack(event) {
		return event.name === 'back';
	}

	back(event) {
		this.repo.get(Router.name).back();
	}

	canDelete(event) {
		return event.name === 'delete' &&	this.view.confirm('Er du sikker på du vil slette denne?');
	}

	delete(event) {
		let proxy = this.repo.get(event.body.cls);
		proxy.delete(event.body.uid);
	}

	canFind(event) {
		if (event.sender === Router.name) {
			return false;
		}
		try {
			let proxy = this.repo.get(event.sender);
			return event.name === proxy.eventOk;
		}
		catch (e) {
			return event.name === this.states.find;
		}
	}

	find(event) {
		let proxy = this.repo.get(event.body == null ? event.sender : event.body.cls);
		proxy.read();
	}
}
exports.ListController = ListController;
