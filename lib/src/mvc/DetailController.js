'use strict';

const BaseController = require('./BaseController.js').BaseController;
const Router = require('./Router.js').Router;
const Transition = require('./Transition.js').Transition;
const CurrentViewState = require('./CurrentViewState.js').CurrentViewState;

class DetailController extends BaseController {

	constructor(activationUri, repo, view) {
		super(activationUri, repo, view);
	}

	populateStateMachine() {
		super.populateStateMachine();

		this.states.update = 'update';
		// Start to Input is handled in super
		// Input
		this.addTransition(new Transition(this.states.input, this.states.update, this.save, this.canSave));
		this.addTransition(new Transition(this.states.input, this.states.start, this.cancel, this.canCancel));
		// Update
		this.addTransition(new Transition(this.states.update, this.states.start, this.back, this.canBack));
		this.addTransition(new Transition(this.states.update, this.states.input, this.fail, this.hasFailed));
	}

	canBack(event) {
		let proxy = this.repo.get(event.sender);
		return event.name === proxy.eventOk;
	}

	back(event) {
		let router = this.repo.get(Router.name);
		router.back();
	}

	canCancel(event) {
		if (event.name !== 'cancel') {
			return false;
		}
		let currentViewState = this.repo.get(CurrentViewState.name);
		if (currentViewState.isDirty) {
			return this.view.confirm("Dine ændringer er ved at gå tabt. Vil du fortsætte?");
		}
		return true;
	}

	cancel(event) {
		let router = this.repo.get(Router.name);
		router.back();
	}

	canSave(event) {
		let currentViewState = this.repo.get(CurrentViewState.name);
		return event.name === 'save' && currentViewState.isValid;
	}

	save(event) {
		let proxy = this.repo.get(event.body.cls);
		proxy.update(event.body.uid);
	}
}
exports.DetailController = DetailController;
