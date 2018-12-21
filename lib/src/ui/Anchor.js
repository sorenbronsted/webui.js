
const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class Anchor extends ElementWrapper {

	constructor(view, anchor, parentClass, factory) {
		super(view, anchor, parentClass);
		this._css = view.cssDelegate.anchor;

		this._element.onclick = (event => {
			event.preventDefault();
			this._view.validateAndfire(this._view.eventClick, true, this.elementValue);
		});
	}

	get value() {
		return this._element.href;
	}

	populate(sender, object) {
		if (this._class !== sender) {
			return;
		}
		if (object.uid !== this._uid) {
			return;
		}
		if (object[this._property] !== null) {
			this._element.href = `/${object[this._property]}`;
		}

		if (this._type === 'menu') {
			this._css.setNotActive(this._element);
			if (object['active'] === 'true') {
				this._css.setActive(this._element);
			}
		}
	}
}

exports.Anchor = Anchor;
