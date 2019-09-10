
const URI = require('uri-js');
const collect = require('collect.js');
const Menu = require('./Menu.js').Menu;
const Subject = require('../mvc/Subject.js').Subject;
const Event = require('../mvc/Event.js').Event;

class MenuProxy extends Subject {
	constructor() {
		super();
		this.eventOk = `proxyOk`;
		this._root = new Menu(0, '/');
		this._populate(this._root);
	}

	populate() {
		this.fire(new Event(this.constructor.name, this.eventOk, this._root));
	}

	/**
	 * Set parameter on menu items by parameter names.
	 * Parameters can come from the query part or from the uri path.
	 *
	 * If the last segment is a number it will match parameters of uid and
	 * if more than 2 segments it will also match second last segment with ${segment}_uid
	 *
	 * It is only the first parameter from the query part which is used.
	 * @param uri
	 */
	setParameter(uri) {
		let parsedUri = URI.parse(uri);
		let pathSegments = parsedUri.path.split('/');
		if (pathSegments.length <= 1) {
			return;
		}

		let args = collect({});
		let lastSegment = pathSegments[pathSegments.length - 1];
		if (!isNaN(lastSegment)) {
			let uid = parseInt(lastSegment);
			args.put('uid', uid);
			if (pathSegments.length >= 2) {
				let proxy = pathSegments[pathSegments.length - 2];
				args.put('proxy', proxy);
				args.put(`${proxy.toLowerCase()}_uid`, uid);
			}
		}

		if (parsedUri.query !== undefined) {
			parsedUri.query.split('&').forEach(elem => {
				let parts = elem.split('=');
				let name = parts[0];
				let value = isNaN(parts[1]) ? parts[1] : parseInt(parts[1]);
				args.put(name, value);
			});
		}

		if (args.keys().isNotEmpty()) {
			this._root.setParameter(args);
		}
	}

	/**
	 * Select an menu item and ensure it is visible
	 * @param uri
	 */
	select(uri) {
		// Don't do anytime if uri does not match
		if (!this._root.hasMatch(uri)) {
			return;
		}
		// reset everything
		this._root.reset();
		// select the node
		this._root.select(uri);
		// ensure visible
		this._root.ensureVisible();
	}

	_populate(root) {
		throw Error("You must override populate");
	}
}
exports.MenuProxy = MenuProxy;
