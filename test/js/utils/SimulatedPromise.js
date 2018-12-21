
class SimulatedPromise {
	constructor(data) {
		this.data = data;
	}

	then(fn) {
		let result;
		try {
			fn(this.data);
		}
		catch (e) {
			result = e;
		}
		return new SimulatedPromise(result);
	}

	catch(fn) {
		if (this.data === undefined) {
			return;
		}
		fn(this.data);
	}
}

exports.SimulatedPromise = SimulatedPromise;