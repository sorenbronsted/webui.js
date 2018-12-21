
const InputCss = require('./InputCss.js').InputCss;
const AnchorCss = require('./AnchorCss.js').AnchorCss;
const TableCss = require('./TableCss.js').TableCss;

class CssDelegate {
	constructor(input = new InputCss(), anchor = new AnchorCss(), table = new TableCss()) {
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