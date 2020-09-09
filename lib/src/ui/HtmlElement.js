const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class HtmlElement extends ElementWrapper {

	constructor(view, elem) {
		super(view, elem);
	}

	populate(sender, value) {
		if (!value || this._class !== sender) {
			return;
		}

		this._element.innerHTML = null;
		this._element.innerHTML = this._view.formatter.display(this._type, value[this._property], this._format);
	}
}

exports.HtmlElement = HtmlElement;