
const collect = require('collect.js');

class Observer {

	constructor() {
		this._handlers = collect({});
	}

	addEventHandler(eventName, handler) {
		this._handlers.put(eventName, handler);
	}

	removeEventHandler(eventName) {
		this._handlers.forget(eventName);
	}

	handleEvent(sender, eventName, body) {
		if (!this._handlers.has(eventName)) {
			return;
		}
		let handler = this._handlers.get(eventName);
		handler.call(this, sender, body);
	}
}

exports.Observer = Observer;