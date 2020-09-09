const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

/**
 * Wrapper for anchor elements
 */
class Anchor extends ElementWrapper {

	/**
	 * The constructor
	 * @param {View} view - The owning view object
	 * @param {HTMLAnchorElement} anchor - The html anchor element
	 */
	constructor(view, anchor) {
		super(view, anchor);
		this._css = view.cssDelegate.anchor;
		this._element.onclick = (event => {
			event.preventDefault();
			this._view.validateAndfire(this._view.eventClick, true, this.elementValue);
		});
	}

	/**
	 * Return the current href of this element
	 * @returns {string}
	 */
	get value() {
		return this._element.href;
	}

	/**
	 * Populates the element
	 * @param {string} sender - name of sender class
	 * @param {Object} object - an object, which must implement uid and the data-property name. If type is menu it must
	 * implement property visible and active
	 */
	populate(sender, object) {
		if (!object || this._class !== sender) {
			return;
		}

		this._uid = object.uid;
		if (object[this._property] !== null) {
			this._element.href = `${object[this._property]}`;
		}

		if (this._type === 'menu') {
			this._css.deselect(this._element);
			if (object.visible) {
				this._css.show(this._element);
				if (object.selected) {
					this._css.select(this._element);
				}
			}
			else {
				this._css.hide(this._element);
			}
		}
	}
}
exports.Anchor = Anchor;
