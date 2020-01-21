const collect = require('collect.js');

/**
 * The class handle events in the order they arrive.
 */
class Observer {

	constructor() {
		this._eventQueue = collect([]);
	}

	/**
	 * Add an event to the queue
	 * @param {Event} event
	 */
	addEvent(event) {
		// Serialize events
		this._eventQueue.prepend(event);
		if (this._eventQueue.count() > 1) {
			return;
		}

		event = this._eventQueue.last();
		while (event != null) {
			try {
				this.handleEvent(event);
			}
			catch (e) { // On error empty
				this._eventQueue = collect([]); // Empty queue
				throw e;
			}
			this._eventQueue.pop();
			event = this._eventQueue.last();
		}
	}

	/**
	 * Handle the event.
	 * @param {Event} event
	 * @abstract
	 */
	handleEvent(event) {
		throw Error('You must override handleEvent')
	}
}
exports.Observer = Observer;