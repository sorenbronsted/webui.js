const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;
const ElementValue = require('../mvc/ElementValue.js').ElementValue;
const Event = require('../mvc/Event.js').Event;

class Th extends ElementWrapper {

	constructor(view, th, cls) {
		super(view, th, cls);
		this._link = this.getAttribute('data-link');
		this._linkClass = this.getAttribute('data-link-class');
		this._linkDisplay = this.getAttribute('data-link-display');
	}

	makeCell(row, css) {
		let cell = this._view._window.document.createElement('td');

		// inherit column hidden property
		cell.hidden = this._element.hidden;

		if (this._link != null) {
			this._addLink(row, cell, css);
		}
		else {
			let value = '';
			if (row[this._property] !== null) {
				value = row[this._property];
			}
			value = this._view.formatter.display(this._type, value, this._format);
			cell.textContent = value;
			if (typeof (this._view.onTableCellValue) === 'function') {
				this._view.onTableCellValue(cell, this._class, this._property, row);
			}
		}
		return cell;
	}

	_addLink(row, cell, css) {
		let a = this._view._window.document.createElement('a');
		let clz = this._class;
		switch(this._link) {
			case 'edit':
				a.href = `/detail/${this._class}/${row.uid}`;
				if (this._property === 'uid') {
					css.onEditLinkLabels(a);
				}
				else {
					a.text = this._view.formatter.display(this._type, row[this._property], this._format);
				}
				break;
			case 'delete':
				a.href = `/detail/${this._class}/${row.uid}`;
				if (this._property === 'uid') {
					css.onDeleteLinkLabels(a);
				}
				else {
					a.text = this._view.formatter.display(this._type, row[this._property], this._format);
				}
				break;
			case 'children':
				a.href = `/list/${this._linkClass}?${this._property}=${row.uid}`;
				a.text = this._view.formatter.display(this._type, row[this._linkDisplay], this._format);
				clz = this._linkClass;
			break;
		}
		if (typeof (this._view.onTableCellLink) === 'function') {
			this._view.onTableCellLink(cell, a, this._class, this._property, row);
		}
		a.onclick = (event => {
			event.preventDefault();
			this._view.validateAndfire(this._link, false, new ElementValue(clz, this._property, row.uid, a.href));
		});
		cell.append(a);
	}

	populate(sender, object) {
		// Do nothing
	}
}

exports.Th = Th;