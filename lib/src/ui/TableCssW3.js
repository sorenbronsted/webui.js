const TableCss = require('./TableCss.js').TableCss;

/**
 * This class implements w3css css
 * @implements TableCss
 */
class TableCssW3 extends TableCss {

	constructor(document) {
		super();
		this._document = document;
	}

	onSortColumn(th, direction) {
		let span;
		if (th.children.length === 0) {
			span = new SpanElement();
			th.append(span);
		}
		else {
			span = th.children.last;
		}

		span.classList.clear();
		span.classList.add('material-icons');
		if (direction === this.asc) {
			span.add("arrow drop down");
		}
		else if (direction === this.dsc) {
			span.add("arrow drop up");
		}
	}

	clearSortColumn(orderBy) {
		orderBy.removeChild();
	}

	onDeleteLinkLabels(a) {
		let span = this._document.createElement('span');
		span.classList.add('material-icons');
		span.innerHTML = 'delete';
		a.append(span);
	}

	onEditLinkLabels(a) {
		let span = this._document.createElement('span');
		span.classList.add('material-icons');
		span.innerHTML = 'create';
		a.append(span);
	}
}
exports.TableCssW3 = TableCssW3;
