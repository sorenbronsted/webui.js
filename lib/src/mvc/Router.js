
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
			event.preventDefault();
			let location = this._window.location;
			this._current = URI.parse(location.toString()).path;
			this.fire(this.eventReadOk, this._current);
		});
	}

	goto(uri) {
		if (uri.match(/^http/)) {
			this._current = URI.parse(uri).path;
		}
		else {
			this._current = uri;
		}

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