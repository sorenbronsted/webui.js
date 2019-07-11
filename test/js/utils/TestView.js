
const ui = require('../../../lib/src/ui');

class TestView extends ui.View {

	constructor(window, html) {
		super(window, "test", html, new ui.CssDelegate(new ui.InputCss(), new ui.AnchorCss(), new ui.TableCss(window.document)));
		this.eventName = null;
		this.isValidRequired = null;
		this.body = null;
	}

	fire(eventName, body) {
		this.validateAndfire(eventName, false, body);
	}

	validateAndfire(eventName, isValidRequired, body) {
		this.eventName = eventName;
		this.isValidRequired = isValidRequired;
		this.body = body;
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