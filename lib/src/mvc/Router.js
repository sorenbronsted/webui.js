const URI = require('uri-js');
const Subject = require('./Subject.js').Subject;
const Event = require('./Event.js').Event;

/**
 * This class monitors and modifies the browser window history object.
 */
class Router extends Subject {

	/**
	 * @param {window} window
	 * 	The browsers window object
	 */
	constructor(window) {
		super();
		this._window = window;
		this._current = null;
		this.cls = this.constructor.name;
		this.eventOk = `routerOk`;

		this._window.onpopstate = (event => {
			let location = this._window.location;
			let destination = URI.parse(location.toString());
			this._current = destination.path + (destination.query === undefined ? '' : '?' + destination.query);
			this.fire(new Event(this.cls , this.eventOk, this._current));
		});
	}

	/**
	 * Goto the reuqested url and inform listeners
	 * @param {string} url
	 * 	The url
	 */
	goto(url) {

		let destination = URI.parse(url);
		this._current = destination.path + (destination.query === undefined ? '' : '?' + destination.query);

		this._window.history.pushState(this._current, null, this._current);
		this.fire(new Event(this.cls, this.eventOk, this._current));
	}

	/**
	 * Call the history.back function
	 */
	back() {
		this._window.history.back();
	}

	/**
	 * Inform listeners of the current url.
	 */
	reload() {
		this.fire(new Event(this.cls, this.eventOk, this._current));
	}
}
exports.Router = Router;
