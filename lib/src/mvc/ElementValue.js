/**
 * This class is used with the view ssend event to the controller
 */
class ElementValue {
	/**
	 * @param {string} cls
	 * 	The name of the class
	 * @param {string} property
	 * 	The name of the property
	 * @param {string} uid
	 * 	The id of the object
	 * @param {string} value
	 * 	The value of the property
	 */
	constructor(cls, property, uid, value) {
		this.cls = cls;
		this.property = property;
		this.uid = uid;
		this.value = value;
	}

	/**
	 * Make it displayable
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this);
	}
}
exports.ElementValue = ElementValue;
