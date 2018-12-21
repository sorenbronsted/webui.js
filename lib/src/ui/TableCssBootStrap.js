
const TableCss = require('./TableCss.js').TableCss;

class TableCssBootStrap extends TableCss {
	constructor(document) {
		super();
		this._document = document;
	}

	onSortColumn(th, direction) {
		var span;
		if (th.children.length === 0) {
			span = this._document.createElement('span');
			th.append(span);
		}
		else {
			span = th.children.lastElementChild;
		}

		span.classes.clear();
		span.classes.add("glyphicon");
		if (direction === this.asc) {
			span.classes.add("glyphicon-triangle-top");
		}
		else if (direction === this.dsc) {
			span.classes.add("glyphicon-triangle-bottom");
		}
	}

	clearSortColumn(orderBy) {
		orderBy.removeChild();
	}

	onDeleteLinkLabels(a) {
		var span = this._document.createElement('span');
		span.classes.add('glyphicon');
		span.classes.add('glyphicon-trash');
		a.append(span);
	}

	onEditLinkLabels(a) {
		var span = this._document.createElement('span');
		span.classes.add('glyphicon');
		span.classes.add('glyphicon-edit');
		a.append(span);
	}
}

exports.TableCssBootStrap = TableCssBootStrap;