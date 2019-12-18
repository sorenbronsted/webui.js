'use strict';

const collect = require('collect.js');
const BaseProxy = require('./BaseProxy.js').BaseProxy;
const Event = require('./Event.js').Event;

class CrudProxy extends BaseProxy {

	constructor(store) {
		super();
		this._store = store;
		this._method = null;

		// const
		this.eventOk = `proxyOk`;
		this.eventFail = `proxyFail`;
	}

	get store() {
		return this._store;
	}

	get method() {
		return this._method;
	}

	set method(method) {
		this._method = method;
	}

	create() {
		const uid = 0;
		const object = {};
		object[this.cls] = {uid:uid};
		this.add(object);
		this.fire(new Event(this.cls, this.eventOk, this.get(uid)));
	}

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

	delete(uid) {
		this.remove(uid);
		this._store.delete(this.cls, uid).then(() => {
			this.fire(new Event(this.cls, this.eventOk));
		}).catch(error => {
			this.fire(new Event(this.cls, this.eventFail, error));
		});
	}

	update(uid) {
		this._store.update(this.cls, this.get(uid)).then((data) => {
			this.fire(new Event(this.cls, this.eventOk, data));
		}).catch((error) => {
			this.fire(new Event(this.cls, this.eventFail, error));
		});
	}
}
exports.CrudProxy = CrudProxy;
