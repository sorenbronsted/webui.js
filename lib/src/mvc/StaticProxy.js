const collect = require('collect.js');
const BaseProxy = require('./BaseProxy.js').BaseProxy;
const Event = require('./Event.js').Event;

/**
 * This class reads a collection of objects during construction and is useful for static data lists and classes
 * that will not change during the lifetime of the sessions
 */
class StaticProxy extends BaseProxy {

	/**
	 * @param {Store} store
	 * 	The delegate which provides the actual storing
	 */
	constructor(store) {
		super();
		this._store = store;
		this._method = null;

		// const
		this.eventOk = `proxyOk`;
		this.eventFail = `proxyFail`;

		this.load()
	}

	/**
	 * Get all objects by an optional filter
	 */
	load() {
		this._store.read(this.cls, collect(this.filterBy), this._method).then(rows => {
			this.addAll(collect(rows));
		}).catch(error => {
			this.fire(new Event(this.cls, this.eventFail, error));
		});
	}

	/**
	 * Gets the store
	 * @returns {Store}
	 * 	The store interface
	 */
	get store() {
		return this._store;
	}

	/**
	 * Gets the name of the method to use when calling the store
	 * @returns {string|null}
	 * 	Then name of the method
	 */
	get method() {
		return this._method;
	}

	/**
	 * Sets the name of method to call og the next store operation og unset it by setting the to null
	 * @returns {string|null}
	 * 	Then name of the method
	 */
	set method(method) {
		this._method = method;
	}

	/**
	 * Get some objects by an optional uid or by the filter and notify listeners on available objects
	 * @param {int|null} uid
	 * 	The uid to find
	 */
	read(uid = null) {
		if (uid !== null) {
			if (this.has(uid) && !this.isDirty(uid)) {
				this.fire(new Event(this.cls, this.eventOk, this.get(uid)));
			}
			else {
				this._store.read(this.cls, collect({uid:uid}), this._method).then(row => {
					this.add(row);
					this.fire(new Event(this.cls, this.eventOk, this.get(uid)));
				}).catch(error => {
					this.fire(new Event(this.cls, this.eventFail, error));
				});
			}
		}
		else {
			if (this.size() !== 0) {
				this.fire(new Event(this.cls, this.eventOk, this.getAll()));
			}
			else {
				this.fire(new Event(this.cls, this.eventFail, 'no instances found'));
			}
		}
	}

	create() {
		this.fire(new Event(this.cls, this.eventFail, 'creation is not allowed on StaticProxy objects'));
	}

	delete(uid) {
		this.fire(new Event(this.cls, this.eventFail, 'deletion is not allowed on StaticProxy objects'));
	}

	update(uid) {
		this.fire(new Event(this.cls, this.eventFail, 'updates are not allowed on StaticProxy objects'));
	}

}
exports.StaticProxy = StaticProxy;
