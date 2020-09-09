const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class Button extends ElementWrapper {

	/**
	 * The constructor
	 * @param {View} view - The owning view object
	 * @param {HTMLButtonElement} button - The html anchor element
	 */
	constructor(view, button) {
		super(view, button);
		if (button.name === null || button.name === '') {
			throw new Error("Button name is required");
		}
		this._validate = true;
		if (button.attributes.getNamedItem('data-validate') != null) {
			this._validate = button.attributes.getNamedItem('data-validate').value.toLowerCase() !== 'false';
		}
		this._property = button.name;
		this._element.onclick = (event => {
			event.preventDefault();
			this._view.validateAndfire(this._property, this._validate, this.elementValue);
		});
	}

	/**
	 * Returns the data-validate attribute
	 * @return boolean
	 */
	get value() {
		this._validate;
	}

	/**
	 * Populates the data-uid attribute
	 * @param {String} sender
	 * @param {Object} object
	 */
	populate(sender, object) 	{
		if (this._class !== sender) {
			return;
		}

		this._uid = object != null ? object.uid : null;
		if (this._uid == null && this._property === 'save') {
			console.error('Button '+this._property+' has empty uid, sender: '+sender);
		}
	}
}
exports.Button = Button;