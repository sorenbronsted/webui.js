
class SimulatedPromise {
	constructor(data) {
		this.data = data;
	}

	then(fn) {
		if (this.data === undefined || this.data.constructor.name !== 'Error') {
			fn(this.data);
		}
		return this;
	}

	catch(fn) {
		if (this.data !== undefined && this.data.constructor.name === 'Error') {
			fn(this.data);
		}
	}
}
exports.SimulatedPromise = SimulatedPromise;