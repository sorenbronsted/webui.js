const BaseController = require('./BaseController.js').BaseController;
const Router = require('./Router.js').Router;
const Transition = require('./Transition.js').Transition;
const CurrentViewState = require('./CurrentViewState.js').CurrentViewState;

/**
 * This class added an update state for handling events save and cancel.
 * <img src="mvc/DetailControllerState.png">
 */
class DetailController extends BaseController {

	constructor(activationUrl, repo, view) {
		super(activationUrl, repo, view);
	}

	/**
	 * Adds state update to exists states in super class.
	 */
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

	/**
	 * Tells if the event is from an proxy and the operation went well.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when failed other false
	 */
	canBack(event) {
		let proxy = this.repo.get(event.sender);
		return event.name === proxy.eventOk;
	}

	/**
	 * Reset the CurrentViewState and call the router to go back.
	 * @param {Event} event
	 * 	The event
	 */
	back(event) {
		this.repo.get(CurrentViewState.name).reset();
		this.repo.get(Router.name).back();
	}

	/**
	 * Tells whether it is a cancel event or not. If it is the CurrentViewState is checked for if the view is dirty,
	 * and if the is the case the user can intervene.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true if event.name is a cancel event or the user want to cancel current editing other false
	 */
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

	/**
	 * Cancel the users current input by going back in the browser.
	 * @param {Event} event
	 * 	The event
	 */
	cancel(event) {
		let router = this.repo.get(Router.name);
		router.back();
	}

	/**
	 * Tells whether it is an save event or not.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true if event.name is a save event other false
	 */
	canSave(event) {
		return event.name === 'save';
	}

	/**
	 * Updates the proxy by the name and uid from the event body.
	 * @param {Event} event
	 * 	The event
	 */
	save(event) {
		this.repo.get(event.body.cls).update(event.body.uid);
	}
}
exports.DetailController = DetailController;
