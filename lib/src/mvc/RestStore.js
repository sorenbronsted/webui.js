
class RestStore {
	constructor(rest) {
		this._rest = rest;
	}

	read(cls, params, method) {
		let url = `/rest/${cls}`;

		if (params !== undefined && params.keys().isNotEmpty()) {
			if (params.has('uid')) {
				url = url.concat('/', params.get('uid'));
				params.forget('uid');
			}
			if (method != null) {
				url = url.concat('/', method);
			}
			if (!params.keys().isEmpty()) {
				let args = this._rest.encodeMap(params);
				url = url.concat('?', args);
			}
		}
		else {
			if (method != null) {
				url = url.concat('/', method);
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

	update(cls, data, method) {
		let url = `/rest/${cls}`;
		if (method !== undefined) {
			url = url.concat('/', method);
		}
		return this._rest.post(url, data);
	}

	postFiles(cls, files, method) {
		let data = new FormData();
		for (let i = 0; i < files.length; i++) {
			data.append('files[]', files[i]);
		}
		let url = `/rest/${cls}`;
		if (method !== undefined) {
			url = url.concat('/', method);
		}
		return this._rest.postFiles(url, data);
	}
}

exports.RestStore = RestStore;
