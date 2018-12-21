
const {JSDOM} = require("jsdom");
const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestView = require('./utils/TestView').TestView;
const TestBrowser = require('./utils/TestBrowser').TestBrowser;

class MyClass extends mvc.BaseProxy {}

describe('Table', function() {

	let object;
	let view;
	let doc;

	beforeEach(function() {
		object = new MyClass();
		object.addAll(collect(JSON.parse(
			'[{"MyClass":{"uid":1,"name":"Kurt Humbuk", "address":"Svindelvej 1"}},' +
			'{"MyClass":{"uid":2,"name":"Yrsa Humbuk", "address":"Svindelvej 2"}}]'
		)));

		let browser = new TestBrowser();
		let css = new ui.CssDelegate();
		view = new TestView(browser.window,
			`<table data-class="MyClass">
				<thead>
					<tr>
						<th data-link="delete" data-property="uid"></th>
						<th data-link="edit" data-property="name"></th>
						<th data-link="children" data-property="myclass_uid" data-link-class="MyChildren" data-link-display="Offspring"></th>
						<th data-property="address"></th>
					</tr>
				</thead>
			</table>
		`);
		doc = browser.window.document;
		view.show();
	});

	it('Should contain rows on populate', function() {
		let table = doc.querySelector("table");
		// Initial should be empty
		assert.equal(table.tHead.rows.length, 1);
		assert.equal(table.tBodies.length, 0);

		// Populate
		view.populate(MyClass.name, object.getAll());

		// Should contain value
		assert.equal(table.tBodies.length, 1);

		let rows = table.tBodies.item(0).getElementsByTagName('tr');
		assert.notEqual(rows, null);
		assert.equal(rows.length, 2);

		let links = table.tBodies.item(0).getElementsByTagName('a');
		assert.notEqual(links, null);
		assert.equal(links.length, 6);

		// load links
		for(let link of links) {
			link.click();
			assert.notEqual(view.eventName, null);
			assert.notEqual(view.body.cls, null);
			assert.notEqual(view.body.property, null);
			assert.notEqual(view.body.uid, null);
			assert.notEqual(view.body.value, null);
		}

		// load callbacks
		assert.equal(view.onTableRowCalled, true);
		assert.equal(view.onTableCellValueCalled, true);
		assert.equal(view.onTableCellLink, true);
	});

	it('Should contain no rows on populate', function() {
		let table = doc.querySelector("table");
		// Initial should be empty
		assert.equal(table.tHead.rows.length, 1);
		assert.equal(table.tBodies.length, 0);

		// Populate
		view.populate(MyClass.name, collect([]));

		assert.equal(table.tBodies.length, 1);

		let cells = table.getElementsByTagName('td');
		assert.notEqual(cells, null);
		assert.equal(cells.length, 1);

		let colspan = cells[0].attributes.getNamedItem('colspan');
		assert.notEqual(colspan, null);
		assert.equal(colspan.value, table.getElementsByTagName('th').length);
	});
});
