
const collect = require('collect.js');
const SimulatedPromise = require('./SimulatedPromise.js').SimulatedPromise;

class TestStore {

	constructor() {
		this.objects = new collect({});
	}

	read(cls, parameters) {
		let result = collect([]);

		if (!this.objects.has(cls)) {
			return new SimulatedPromise([]);
		}

		if (parameters === undefined) {
			parameters = collect({});
		}
		this.objects.get(cls).values().each(value => {
			let match = 0;
			parameters.each(p => {
				if (p === value) {
					match++;
				}
			});

			if (match === parameters.count()) {
				let o = {};
				o[cls] = value;
				result.push(o);
			}
		});
		return new SimulatedPromise(result.all());
	}

	delete(cls, uid) {
		if (!this.objects.has(cls)) {
			throw new Error(`${cls} not found`);
		}
		this.objects.get(cls).forget(uid);
		return new SimulatedPromise();
	}

	update(cls, data) {
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