class RestStore {
	constructor(rest) {
		this._rest = rest;
	}

	read(cls, params) {
		if (params !== '' && params !== null && params !== undefined) {
			let args = this._rest.encodeMap(params);
			return this._rest.get(`/rest/${cls}?${args}`);
		} else {
			return this._rest.get(`/rest/${cls}`);
		}
	}

	delete(cls, uid) {
		return this._rest.delete(`/rest/${cls}/${uid}`);
	}

	update(cls, object) {
		return this._rest.post(`/rest/${cls}`, object);
	}
}

exports.RestStore = RestStore;