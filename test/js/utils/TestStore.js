
const collect = require('collect.js');
const mvc = require('../../../lib/src/mvc');
const SimulatedPromise = require('./SimulatedPromise.js').SimulatedPromise;

class TestStore extends mvc.Store {

	constructor() {
		super();
		this.objects = new collect({});
		this.triggerError = false;
	}

	read(cls, parameters, method) {
		if (this.triggerError) {
			return new SimulatedPromise(Error("Simulated error"));
		}
		let result = collect([]);

		if (!this.objects.has(cls)) {
			return new SimulatedPromise([]);
		}

		if (parameters === undefined || parameters.keys().isEmpty()) {
			parameters = collect({});
		}

		this.objects.get(cls).values().each(value => {
			let match = 0;
			parameters.each((pValue, pkey) => {
				if (pValue === value[pkey]) {
					match++;
				}
			});

			if (match === parameters.values().count()) {
				let o = {};
				o[cls] = value;
				result.push(o);
			}
		});
		if (result.count() === 0) {
			return new SimulatedPromise(Error("Not found"));
		}
		return new SimulatedPromise(result.count() === 1 && parameters.has('uid') ? result.first() : result.all());
	}

	delete(cls, uid) {
		if (this.triggerError) {
			return new SimulatedPromise(Error("Simulated error"));
		}
		try {
			if (!this.objects.has(cls) || !this.objects.get(cls).has(uid)) {
				throw Error('Object not found');
			}
			this.objects.get(cls).forget(uid);
		}
		catch (e) {
			return new SimulatedPromise(e);
		}
		return new SimulatedPromise();
	}

	update(cls, data, method) {
		if (this.triggerError) {
			return new SimulatedPromise(Error("Simulated error"));
		}
		if (!this.objects.has(cls)) {
			this.objects.put(cls, collect({}));
		}
		let objects = this.objects.get(cls);

		if (data.uid === 0) {
			data.uid = objects.count() + 1;
		}
		objects.put(data.uid, data);
		return new SimulatedPromise();
	}
}
exports.TestStore = TestStore;