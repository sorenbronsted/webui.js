const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class Span extends ElementWrapper {

	constructor(view, elem, cls) {
		super(view, elem, cls);
	}

	populate(sender, value) {
		if (this._class !== sender) {
			return;
		}

		this._element.innerHTML = null;
		this._element.innerHTML = this._view.formatter.display(this._type, value[this._property], this._format);
	}
}

exports.Span = Span;