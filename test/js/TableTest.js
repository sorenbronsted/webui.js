
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
		assert.strictEqual(table.tHead.rows.length, 1);
		assert.strictEqual(table.tBodies.length, 0);

		// Populate
		view.populate(MyClass.name, object.getAll());

		// Should contain value
		assert.strictEqual(table.tBodies.length, 1);

		let rows = table.tBodies.item(0).getElementsByTagName('tr');
		assert.notStrictEqual(rows, null);
		assert.strictEqual(rows.length, 2);

		let links = table.tBodies.item(0).getElementsByTagName('a');
		assert.notStrictEqual(links, null);
		assert.strictEqual(links.length, 6);

		// load links
		for(let link of links) {
			link.click();
			assert.notStrictEqual(view.eventName, null);
			assert.notStrictEqual(view.body.cls, null);
			assert.notStrictEqual(view.body.property, null);
			assert.notStrictEqual(view.body.uid, null);
			assert.notStrictEqual(view.body.value, null);
		}

		// load callbacks
		assert.strictEqual(view.onTableRowCalled, true);
		assert.strictEqual(view.onTableCellValueCalled, true);
		assert.strictEqual(view.onTableCellLink, true);
	});

	it('Should contain no rows on populate', function() {
		let table = doc.querySelector("table");
		// Initial should be empty
		assert.strictEqual(table.tHead.rows.length, 1);
		assert.strictEqual(table.tBodies.length, 0);

		// Populate
		view.populate(MyClass.name, {objects: collect([])});

		assert.strictEqual(table.tBodies.length, 1);

		let cells = table.getElementsByTagName('td');
		assert.notStrictEqual(cells, null);
		assert.strictEqual(cells.length, 1);

		let colspan = cells[0].attributes.getNamedItem('colspan');
		assert.notStrictEqual(colspan, null);
		assert.strictEqual(parseInt(colspan.value), table.getElementsByTagName('th').length);
	});
});
