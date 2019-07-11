'use strict';

const collect = require('collect.js');

class StateMachine {
	/**
	 * The construtcor
	 */
	constructor(handler) {
		if (handler == null) {
			throw Error('Illegal arguments');
		}
		this._transitions = collect({});
		this._state = 'start';
		this._handler = handler;
		this._eventQueue = collect([]);
	}

	/**
	 * Get current state
	 * @returns {string}
	 */
	get state() {
		return this._state;
	}

	/**
	 * Add a single transition
	 * @param {Transition} transition
	 */
	add(transition) {
		let transitions = this._transitions.get(transition.from);
		if (transitions == null) {
			transitions = collect([]);
			this._transitions.put(transition.from, transitions)
		}
		//TODO The to-state must be uniq in these transitions
		transitions.push(transition);
	}

	/**
	 * Run the statemachine
	 */
	run(event) {
		//console.log(`${this._handler.constructor.name} ${event.toString()}`);

		// Serialize events
		this._eventQueue.prepend(event);
		if (this._eventQueue.count() > 1) {
			return;
		}

		event = this._eventQueue.last();
		while (event != null) {
			let transitions = this._transitions.get(this._state);
			if (transitions == null) {
				throw Error(`No transitions found from state: ${this._state}`);
			}
			transitions.each(transtion => {
				if (transtion.canChange === undefined || transtion.canChange.call(this._handler, event)) {
					try {
						this._state = transtion.to;
						if (transtion.action != null) {
							console.log(`${this._handler.constructor.name} State from: ${transtion.from} to: ${this._state} ${event.toString()}`);
							transtion.action.call(this._handler, event);
							return false;
						}
						else {
							console.warn(`${this._handler.constructor.name} State from: ${transtion.from} to: ${this._state} ${event.toString()} has an empty action`)
						}
					}
					catch (e) {
						this._state = transtion.from;
						this._eventQueue = collect([]); // Empty queue
						throw e;
					}
				}
			});
			this._eventQueue.pop();
			event = this._eventQueue.last();
		}
	}
}
exports.StateMachine = StateMachine;