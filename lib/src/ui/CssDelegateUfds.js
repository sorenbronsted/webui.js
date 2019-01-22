const InputCssUfds = require('./InputCssUfds.js').InputCssUfds;
const AnchorCssUfds = require('./AnchorCssUfds.js').AnchorCssUfds;
const TableCssUfds = require('./TableCssUfds.js').TableCssUfds;
const flatpickr = require("flatpickr");
const Danish = require("flatpickr/dist/l10n/da.js").default.da;

class CssDelegateUfds {
	constructor(input = new InputCssUfds(), anchor = new AnchorCssUfds(), table = new TableCssUfds()) {
		this._input = input;
		this._anchor = anchor;
		this._table = table;
	}

	get input() {
		let dates = document.querySelector('input[data-type="date"][type="text"]');
		if (dates != null) {
			console.log(dates);
			flatpickr.localize(Danish);
			dates.forEach(function (date) {
				flatpickr(date);
				console.log(date);
			});
		}
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