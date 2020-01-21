
const URI = require('uri-js');
const collect = require('collect.js');
const Menu = require('./Menu.js').Menu;
const Subject = require('../mvc/Subject.js').Subject;
const Event = require('../mvc/Event.js').Event;

/**
 * This class is the model for the menu system and contains the current state of the for it.
 * It hold the root for the menu hierarchy.
 */
class MenuProxy extends Subject {
	constructor() {
		super();
		this.eventOk = `proxyOk`;
		this._root = new Menu(0, '/');
		this.init(this._root);
		this.populate();
	}

	populate() {
		this.fire(new Event(this.constructor.name, this.eventOk, this._root));
	}

	/**
	 * Set a parameter on menu items by parameter names.
	 * Parameters can come from the query part or from the uri path.
	 * If the last segment is a number it will match parameters of uid and
	 * if more than 2 segments it will also match second last segment with ${segment}_uid
	 * It is only the first parameter from the query part which is used.
	 * @param {string} url
	 * 	A given url
	 */
	setParameter(url) {
		let parsedUri = URI.parse(url);
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
	 * @param {string} url
	 * 	A given url
	 */
	select(url) {
		// Don't do anytime if uri does not match
		if (!this._root.hasMatch(url)) {
			return;
		}
		// reset everything
		this._root.reset();
		// select the node
		this._root.select(url);
		// ensure visible
		this._root.ensureVisible();
	}

	/**
	 * Initialize the menu hierarchy. Eg:
	 * @param {Menu} root
	 * 	The root of the menu hierarchy
	 * @example
	 * let child = root.push(new Menu(1, '/some/url'));
	 * let grandChild = child.push(new Menu(5, '/some/url'));
	 * grandchild.push(new Menu(15, '/some/url'));
	 */
	init(root) {
		throw Error("You must override the init method");
	}
}
exports.MenuProxy = MenuProxy;
