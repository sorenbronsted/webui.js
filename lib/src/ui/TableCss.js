class TableCss {

	constructor() {
		this.asc = 1;
		this.dsc = 2;
	}

	onSortColumn(th, direction) {}

	clearSortColumn(orderBy) {}

	onEditLinkLabels(a) {
		a.innerHTML = 'E';
	}

	onDeleteLinkLabels(a) {
		a.innerHTML = 'X';
	}
}

exports.TableCss = TableCss;