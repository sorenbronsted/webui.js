
class CssDelegate {
	constructor(input, anchor, table) {
		if (input == null) {
			throw new Error('Illegal argument for input');
		}
		if (anchor == null) {
			throw new Error('Illegal argument for anchor');
		}
		if (table == null) {
			throw new Error('Illegal argument for table');
		}
		this._input = input;
		this._anchor = anchor;
		this._table = table;
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
}
exports.CssDelegate = CssDelegate;