const collect = require('collect.js');
const BaseProxy = require('./BaseProxy.js').BaseProxy;

class CrudProxy extends BaseProxy {

	constructor(store) {
		super();
		this._store = store;

		// const
		this.eventCreateOk = `${this.cls}/CreateOk`;
		this.eventCreateFail = `${this.cls}/CreateFail`;
		this.eventReadOk = `${this.cls}/ReadOk`;
		this.eventReadFail = `${this.cls}/ReadFail`;
		this.eventUpdateOk = `${this.cls}/UpdateOk`;
		this.eventUpdateFail = `${this.cls}/UpdateFail`;
		this.eventDeleteOk = `${this.cls}/DeleteOk`;
		this.eventDeleteFail = `${this.cls}/DeleteFail`;
	}

	create() {
		const uid = 0;
		this._objects.put(uid, {'uid':uid});
		this.fire(this.eventCreateOk, this._objects.get(uid));
	}

	read(args) {
		if (args !== undefined && typeof args.has === 'function' && args.has('uid')) {
			let uid = args.get('uid');
			if (typeof uid === 'string') {
				uid = parseInt(uid);
			}
			if (this._objects.has(uid)) {
				this.fire(this.eventReadOk, this._objects.get(uid));
			}
			else {
				this.fire(this.eventReadFail, `${this.cls} not found, uid: ${uid}`);
			}
		}
		else {
			this._store.read(this.cls, args).then(rows => {
				this.addAll(collect(rows));
				this.fire(this.eventReadOk, this.getAll());
			}).catch(error => {
				this.fire(this.eventReadFail, error);
			});
		}
	}

	delete(uid) {
		this._objects.forget(uid);
		this._store.delete(this.cls, uid).then(() => {
			this.fire(this.eventDeleteOk);
		}).catch(error => {
			this.fire(this.eventDeleteFail, error);
		});
	}

	update(uid) {
		this._store.update(this.cls, this.get(uid)).then(() => {
			console.log(this.cls);
			this.fire(this.eventUpdateOk);
		}).catch((error) => {
			this.fire(this.eventUpdateFail, error);
		});
	}
}

exports.CrudProxy = CrudProxy;