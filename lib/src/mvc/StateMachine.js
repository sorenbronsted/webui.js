const collect = require('collect.js');
const moment = require('moment');

/**
 * The class implements a classic statemachine which allow state to change
 * when the {@link Transition|transtion guard function} is true.
 * Upon the change the {@link Transition|transition action function} is called
 */
class StateMachine {
	/**
	 * The construtcor
	 * @param {Object} handler
	 * 	The object to control.
	 */
	constructor(handler) {
		if (handler == null) {
			throw Error('Illegal arguments');
		}
		this._transitions = collect({});
		this._state = 'start';
		this._handler = handler;
	}

	/**
	 * Get current state
	 * @returns {string}
	 * 	The current state
	 */
	get state() {
		return this._state;
	}

	/**
	 * Add a single transition
	 * @param {Transition} transition
	 * 	The transition
	 */
	add(transition) {
		let transitions = this._transitions.get(transition.from);
		if (transitions == null) {
			transitions = collect([]);
			this._transitions.put(transition.from, transitions)
		}
		transitions.push(transition);
	}

	/**
	 * Run the statemachine
	 * @param {Event} event
	 * 	The event.
	 */
	run(event) {
		//console.log(`${this._handler.constructor.name} ${event.toString()}`);

		let transitions = this._transitions.get(this._state);
		if (transitions == null) {
			throw Error(`No transitions found from state: ${this._state}`);
		}
		transitions.each(transtion => {
			if (transtion.canChange == null || transtion.canChange.call(this._handler, event)) {
				let ts = moment().format('hh:mm:ss:SSS');
				try {
					this._state = transtion.to;
					if (transtion.action != null) {
						console.log(`${ts} ${this._handler.constructor.name} State from: ${transtion.from} to: ${this._state} ${event.toString()}`);
						transtion.action.call(this._handler, event);
						return false;
					} else {
						console.warn(`${ts} ${this._handler.constructor.name} State from: ${transtion.from} to: ${this._state} ${event.toString()} has an empty action`)
					}
				} catch (e) {
					this._state = transtion.from;
					throw e;
				}
			}
		});
	}
}
exports.StateMachine = StateMachine;