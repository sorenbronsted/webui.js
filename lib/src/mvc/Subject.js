
const collect = require('collect.js');

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

	fire(eventName, body) {
		const name = this.constructor.name;
		this._observers.each(observer => {
			observer.handleEvent(name, eventName, body)
		});
	}
}

exports.Subject = Subject;