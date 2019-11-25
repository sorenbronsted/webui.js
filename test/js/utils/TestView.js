
const collect = require('collect.js');
const ui = require('../../../lib/src/ui');

class TestView extends ui.View {

	constructor(window, html) {
		super(window, "test", html, new ui.CssDelegate(new ui.InputCss(), new ui.AnchorCss(), new ui.TableCss(window.document)));
		this.events = collect([]);
	}

	fire(event) {
		this.events.push(event);
	}

	onTableRow(tableRow, row) {
		this.onTableRowCalled = true;
	}

	onTableCellValue(cell, cls, property, row) {
		this.onTableCellValueCalled = true;
	}

	onTableCellLink(cell, link, cls, property, row) {
		this.onTableCellLink = true;
	}
}
exports.TestView = TestView;