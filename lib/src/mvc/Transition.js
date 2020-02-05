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
		if (from == null || from.length <= 0) {
			throw Error('from state is empty');
		}
		if (to == null || to.length <= 0) {
			throw Error('to state is empty');
		}
		if (action == null) {
			throw Error('action is not defined');
		}
		if (canChange == null) {
			console.warn('canChange is not defined');
		}
		this.from = from;
		this.to = to;
		this.action = action;
		this.canChange = canChange;
	}
}
exports.Transition = Transition;