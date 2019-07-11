
class Event {
	/**
	 * The constructor
	 * @param {string} sender name of sender
	 * @param {string} name name of event
	 * @param {object} body event data from sender
	 */
	constructor(sender, name, body = null) {
		this.sender = sender;
		this.name = name;
		this.body = body;
	}

	toString() {
		return `Event: ${JSON.stringify({sender:this.sender, name:this.name})}`;
	}
}
exports.Event = Event;