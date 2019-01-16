const InputCss = require('./InputCssUfds.js').InputCssUfds;
const AnchorCss = require('./AnchorCssUfds.js').AnchorCssUfds;
const TableCss = require('./TableCssUfds.js').TableCssUfds;

class CssDelegateUfds {
	constructor(input = new InputCssUfds(), anchor = new AnchorCssUfds(), table = new TableCssUfds()) {
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

exports.CssDelegateUfds = CssDelegateUfds;