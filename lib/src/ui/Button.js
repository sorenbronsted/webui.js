
const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class Button extends ElementWrapper {

	constructor(view, button, cls) {
		super(view, button, cls);
		if (button.name === null || button.name === '') {
			throw new Error("Button name is required");
		}
		if (this.cls === null || this.cls === '') {
			throw new Error("Button data-class is required");
		}
		this._validate = true;
		if (button.attributes.getNamedItem('data-validate') !== null) {
			this._validate = button.attributes.getNamedItem('data-validate').value.toLowerCase() !== 'false';
		}
		this._property = button.name;
		this._element.onclick = (event => {
			event.preventDefault();
			this._view.validateAndfire(this._property, this._validate, this.elementValue);
		});
	}

	populate(sender, object) 	{
		if (this._class !== sender) {
			return;
		}
		if (object[this._uid] !== null) {
			this._uid = object.uid;
		}
	}
}

exports.Button = Button;