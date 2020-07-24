const collect = require('collect.js');
const URI = require('uri-js');
const BaseController = require('./BaseController.js').BaseController;
const Router = require('./Router.js').Router;
const Transition = require('./Transition.js').Transition;

/**
 * This class added an find and delete state for handling events find and delete.
 * <img src="mvc/ListControllerState.png">
 */
class ListController extends BaseController {

	constructor(activationUri, repo, view) {
		super(activationUri, repo, view);
	}

	/**
	 * Adds states create,find and delete to exists states in super class.
	 */
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

	/**
	 * Tells if the event.name == 'edit' or not.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when event is edit other false
	 */
	canEdit(event) {
		return event.name === 'edit';
	}

	/**
	 * Goto to the edit url which is <code>/detail/someClass/someObjectUid</code>
	 * @param {event} event
	 */
	edit(event) {
		// Body comes properly from a anchor
		let url = `/detail/${event.body.cls}/${event.body.uid}`;
		if (event.body.value != null) {
			url = URI.parse(event.body.value).path;
		}
		this.repo.get(Router.name).goto(url);
	}

	/**
	 * Tells if the event.name == 'create' or not.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when event is create other false
	 */
	canCreate(event) {
		return event.name === 'create';
	}

	/**
	 * Goto to the create url which is <code>/detail/someClass/new</code>
	 * @param {event} event
	 */
	create(event) {
		this.repo.get(Router.name).goto(`/detail/${event.body.cls}/new`);
	}

	/**
	 * Tells if the event.name == 'children' or not.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when event is children other false
	 */
	canChildren(event) {
		return event.name === 'children';
	}

	/**
	 * Goto to the children url from event.body.value
	 * @param {event} event
	 */
	children(event) {
		this.repo.get(Router.name).goto(event.body.value);
	}

	/**
	 * Tells if the event.name == 'back'
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when failed other false
	 */
	canBack(event) {
		return event.name === 'back';
	}

	/**
	 * Ask the router to go back
	 * @param {Event} event
	 * 	The event
	 */
	back(event) {
		this.repo.get(Router.name).back();
	}

	/**
	 * Tells if the event.name == 'delete' and the user wants to delete selected item
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when event is delete and user reponse is ok other false
	 */
	canDelete(event) {
		return event.name === 'delete' &&	this.view.confirm('Er du sikker på du vil slette denne?');
	}

	/**
	 * Tell the proxy to delete chosen element
	 * @param {Event} event
	 * 	The event
	 */
	delete(event) {
		let proxy = this.repo.get(event.body.cls);
		proxy.delete(event.body.uid);
	}

	/**
	 * Tells if the event.name == 'find' or not.
	 * @param {Event} event
	 * 	The event
	 * @returns {boolean}
	 * 	true when event is find other false
	 */
	canFind(event) {
		//TODO this looks a little funny
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

	/**
	 * Tell the proxy to find objects
	 * @param {Event} event
	 * 	The event
	 */
	find(event) {
		let proxy = this.repo.get(event.body == null ? event.sender : event.body.cls);
		proxy.read();
	}
}
exports.ListController = ListController;
