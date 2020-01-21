/**
 * The default TableElement interface to css operations
 */
class TableCss {

	constructor() {
		this._asc = 1;
		this._dsc = 2;
	}

	onSortColumn(th, direction) {}

	clearSortColumn(orderBy) {}

	/**
	 * This add the text 'E' to the anchor
	 * @param {HTMLAnchorElement} a
	 */
	onEditLinkLabels(a) {
		a.innerHTML = 'E';
	}

	/**
	 * This add the text 'X' to the anchor
	 * @param {HTMLAnchorElement} a
	 */
	onDeleteLinkLabels(a) {
		a.innerHTML = 'X';
	}
}
exports.TableCss = TableCss;