const collect = require('collect.js');
const BaseProxy = require('./BaseProxy.js').BaseProxy;
const Event = require('./Event.js').Event;

/**
 * This class provides the basic Create,Read,Update and Delete (CRUD) operations which are needed by almost any proxy,
 * which need to persistent anything.
 */
class CrudProxy extends BaseProxy {

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
	 * Create a new object and notify listeners. The object will hae uid == 0.
	 */
	create() {
		const uid = 0;
		const object = {};
		object.class = this.cls;
		object.uid = uid;
		this.add(object);
		this.fire(new Event(this.cls, this.eventOk, this.get(uid)));
	}

	/**
	 * Get some objects by an optional uid or by the filter and notify listeners on available objects
	 * @param {int} uid
	 * 	The uid to find
	 */
	read(uid) {
		if (uid != null) {
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
			this._store.read(this.cls, collect(this.filterBy), this._method).then(rows => {
				this.addAll(collect(rows));
				this.fire(new Event(this.cls, this.eventOk, this.getAll()));
			}).catch(error => {
				this.fire(new Event(this.cls, this.eventFail, error));
			});
		}
	}

	/**
	 * Delete some object by uid and notify listeners when complete
	 * @param {int} uid
	 * 	Then uid of the object to delete
	 */
	delete(uid) {
		this.remove(uid);
		this._store.delete(this.cls, uid).then(() => {
			this.fire(new Event(this.cls, this.eventOk));
		}).catch(error => {
			this.fire(new Event(this.cls, this.eventFail, error));
		});
	}

	/**
	 * Update an object identified by uid and notify listeners when complete
	 * @param {int} uid
	 * 	Then uid of the object to update
	 */
	update(uid) {
		this._store.update(this.cls, this.get(uid)).then((data) => {
			this.fire(new Event(this.cls, this.eventOk, data));
		}).catch((error) => {
			this.fire(new Event(this.cls, this.eventFail, error));
		});
	}
}
exports.CrudProxy = CrudProxy;
