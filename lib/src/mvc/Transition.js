'use strict';

class Transition {
	/**
	 * The constructor
	 * @param {string} from - the from state
	 * @param {string} to - the to state
	 * @param {Function} action - the action to call if this transtion allows to change
	 * @param {Function} canChange - guard function determis upon true and false if the transition is allowed
	 */
	constructor(from, to, action, canChange) {
		this.from = from;
		this.to = to;
		this.action = action;
		this.canChange = canChange;
	}
}
exports.Transition = Transition;