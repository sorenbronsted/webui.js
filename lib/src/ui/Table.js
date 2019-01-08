
const collect = require('collect.js');
const ContainerWrapper = require('./ContainerWrapper.js').ContainerWrapper;

/*
The following functions are callback functions, which you implement in your view class
and thay are called during processing the rows

	onTableRow(tableRow, row)
		tableRow: is a tr element
		row: is the current row being processed

	onTableCellValue(cell, cls, property, row)
		cell: is a td element
		cls: is the name of the class from the th element
		property: is the name of the property being processed
		row: is the current row being processed

	onTableCellLink(cell, link, cls, property, row)
		cell: is a td element
		link: is a anchor(a) element
		cls: is the name of the class from the th element
		property: is the name of the property being processed
		row: is the current row being processed
*/

class Table extends ContainerWrapper {
	constructor(view, table, parentClass, factory) {
		super(view, table, null, factory);

		this._factory = factory;
		this._none = 0;
		this._css = view.cssDelegate.table;

		this._orderBy = null;
		this._direction = this._none;
		this._rowElements = collect({}); // elements on rows which are populated by TableListener

		if (table.tHead == null || table.tHead.rows.length !== 1) {
			throw new Error("Must have a thead element");
		}
		if (table.tBodies.length > 1) {
			throw new Exception("Multiple bodies not supported");
		}

		table.tHead.querySelectorAll('th[data-property]').forEach(element => {
			let elementWrapper = factory.make(view, element, this._class);
			this._elements.push(elementWrapper);
			if (elementWrapper._element.classList.contains('sortable')) {
				elementWrapper._element.click(event => {
					event.preventDefault();
					this._setSortingUi(event.target);
					this._doSort();
				});
			}
		});
	}

	set css(css) {
		this._css = css;
	}

	populate(sender, rows) {
		if (this._class !== sender) {
			return;
		}

		// Clear rows
		this._rowElements = collect({});
		if (this._element.tBodies.length > 0) {
			let bodies = this._element.getElementsByTagName('tbody');
			for (let i = 0; i < bodies.length; i++) {
				this._element.removeChild(bodies[i]);
			}
		}

		// Add new rows
		let fragment;
		if (rows.isEmpty()) {
			fragment = this._noRows();
		}
		else {
			fragment = this._addRows(rows);
		}
		// Wrap all elements added to this fragment
		fragment.querySelectorAll('[data-property]').forEach(element => {
			this._rowElements.push(this._factory.make(this._view, element, this._class));
		});
		this._element.append(fragment);
	}

	_addRows(rows) {
		let fragment = this._view.window.document.createElement('tbody');
		rows.each(row => {
			let tableRow = this._view.window.document.createElement('tr');
			if (typeof (this._view.onTableRow) === 'function') {
				this._view.onTableRow(tableRow, row);
			}

			// Make the table row
			fragment.append(tableRow);
			this._elements.each(th => {
				let td = th.makeCell(row, this._css);
				tableRow.append(td);
			});
		});
		return fragment;
	}

	_noRows() {
		let tableCell = this._view._window.document.createElement('td');
		tableCell.colSpan = this._element.getElementsByTagName('th').length;
		tableCell.textContent = 'Ingen data fundet';
		tableCell.classList.add('center');

		let fragment = this._view._window.document.createElement('tbody');
		let tableRow = this._view._window.document.createElement('tr');
		fragment.append(tableRow);
		tableRow.append(tableCell);
		return fragment;
	}

	_doSort() {
		throw new Error('Not implemented');
	}

	_setSortingUi(target) {
		throw new Error('Not implemented');
	}
}

exports.Table = Table;