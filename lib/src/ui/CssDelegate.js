
class CssDelegate {
	constructor(input, anchor, table, view) {
		if (input == null) {
			throw new Error('Illegal argument for input');
		}
		if (anchor == null) {
			throw new Error('Illegal argument for anchor');
		}
		if (table == null) {
			throw new Error('Illegal argument for table');
		}
		if (view == null) {
			throw new Error('Illegal argument for view');
		}
		this._input = input;
		this._anchor = anchor;
		this._table = table;
		this._view = view;
	}

	get input() {
		return this._input;
	}

	get anchor() {
		return this._anchor;
	}

	get table() {
		return this._table;
	}

	get view() {
		return this._view;
	}
}
exports.CssDelegate = CssDelegate;