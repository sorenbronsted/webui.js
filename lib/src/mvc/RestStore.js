
class RestStore {
	constructor(rest) {
		this._rest = rest;
	}

	read(cls, params) {
		let url = `/rest/${cls}`;
		if (params !== undefined) {
			if (params.has('uid')) {
				url = url.concat('/', params.get('uid'));
				params.forget('uid');
			}
			if (!params.isEmpty()) {
				let args = this._rest.encodeMap(params);
				url = url.concat('?', args);
			}
		}
		return this._rest.get(url);
	}

	delete(cls, uid) {
		if (uid === undefined) {
			throw "Not uid";
		}
		return this._rest.delete(`/rest/${cls}/${uid}`);
	}

	update(cls, object) {
		return this._rest.post(`/rest/${cls}`, object);
	}
}

exports.RestStore = RestStore;