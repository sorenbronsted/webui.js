const TableCss = require('./TableCss.js').TableCss;

/**
 * This class implements BootStrap css
 * @implements TableCss
 */
class TableCssBootStrap extends TableCss {
	constructor(document) {
		super();
		this._document = document;
	}

	onSortColumn(th, direction) {
		let span;
		if (th.children.length === 0) {
			span = this._document.createElement('span');
			th.append(span);
		}
		else {
			span = th.children.lastElementChild;
		}

		span.classList.clear();
		span.classList.add("glyphicon");
		if (direction === this.asc) {
			span.classList.add("glyphicon-triangle-top");
		}
		else if (direction === this.dsc) {
			span.classList.add("glyphicon-triangle-bottom");
		}
	}

	clearSortColumn(orderBy) {
		orderBy.removeChild();
	}

	onDeleteLinkLabels(a) {
		let span = this._document.createElement('span');
		span.classList.add('glyphicon');
		span.classList.add('glyphicon-trash');
		a.append(span);
	}

	onEditLinkLabels(a) {
		let span = this._document.createElement('span');
		span.classList.add('glyphicon');
		span.classList.add('glyphicon-edit');
		a.append(span);
	}
}

exports.TableCssBootStrap = TableCssBootStrap;