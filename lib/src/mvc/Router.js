
const URI = require('uri-js');
const Subject = require('./Subject.js').Subject;

class Router extends Subject {

	constructor(window) {
		super();
		this._window = window;
		this._current = null;
		this.cls = this.constructor.name;
		this.eventReadOk = `${this.cls}/ReadOk`;

		this._window.onpopstate = (event => {
			let location = this._window.location;
			let destination = URI.parse(location.toString());
			this._current = destination.path + (destination.query === undefined ? '' : '?' + destination.query);
			this.fire(this.eventReadOk, this._current);
		});
	}

	goto(uri) {

		let destination = URI.parse(uri);
		this._current = destination.path + (destination.query === undefined ? '' : '?' + destination.query);

		this._window.history.pushState(this._current, null, this._current);
		this.fire(this.eventReadOk, this._current);
	}

	back() {
		this._window.history.back();
	}

	reload() {
		this.fire(this.eventReadOk, this._current);
	}
}

exports.Router = Router;
