const collect = require('collect.js');
const Event = require('./Event.js').Event;

/**
 * This class has a collection of observers where to events are fired.
 */
class Subject {

	constructor() {
		this._observers = collect({});
	}

	/**
	 * Added an observer. It can only be added once.
	 * @param {Observer} observer
	 * 	The observer to add
	 */
	addEventListener(observer) {
		if (this._observers.has(observer.constructor.name)) {
			return;
		}
		this._observers.put(observer.constructor.name, observer);
	}

	/**
	 * Remove an observer
	 * @param {Observer} observer
	 * 	The observer to be removed
	 */
	removeEventListener(observer) {
		if (!this._observers.has(observer.constructor.name)) {
			return;
		}
		this._observers.forget(observer.constructor.name);
	}

	/**
	 * Send an event to all observers.
	 * @param {Event} event
	 * 	The event
	 */
	fire(event) {
		if (event == null || event.constructor.name !== Event.name) {
			throw new Error(`Illegal argument, must be of type Event`);
		}
		this._observers.each(observer => {
			observer.addEvent(event)
		});
	}
}
exports.Subject = Subject;