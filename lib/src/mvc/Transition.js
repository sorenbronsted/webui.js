/**
 * This class has information about a state change.
 */
class Transition {
	/**
	 * The constructor
	 * @param {string} from
	 * 	The from state
	 * @param {string} to
	 * 	The to state
	 * @param {Function} action
	 *	The action to call if this transtion allows to change
	 * @param {Function} canChange
	 * 	Guard function determis upon true and false if the transition is allowed
	 */
	constructor(from, to, action, canChange) {
		this.from = from;
		this.to = to;
		this.action = action;
		this.canChange = canChange;
	}
}
exports.Transition = Transition;