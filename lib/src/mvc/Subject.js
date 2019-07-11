'use strict';

const collect = require('collect.js');
const Event = require('./Event.js').Event;

class Subject {

	constructor() {
		this._observers = collect({});
	}

	addEventListener(observer) {
		if (this._observers.has(observer.constructor.name)) {
			return;
		}
		this._observers.put(observer.constructor.name, observer);
	}

	removeEventListener(observer) {
		if (!this._observers.has(observer.constructor.name)) {
			return;
		}
		this._observers.forget(observer.constructor.name);
	}

	fire(event) {
		if (event == null || event.constructor.name !== Event.name) {
			throw new Error(`Illegal argument, must be of type Event`);
		}
		this._observers.each(observer => {
			observer.handleEvent(event)
		});
	}
}
exports.Subject = Subject;