const {JSDOM} = require("jsdom");
const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const TestView = require('./utils/TestView').TestView;
const TestBrowser = require('./utils/TestBrowser').TestBrowser;

class MyClass extends mvc.BaseProxy {
	constructor() {
		super();
		super.add(JSON.parse('{"MyClass":{"uid":1,"value_uid":2}}'));
	}
}

class MyList extends mvc.BaseProxy {
	constructor() {
		super();
		super.addAll(collect(JSON.parse('[{"MyList":{"uid":1,"text":"dog"}},{"MyList":{"uid":2,"text":"cat"}}]')));
	}
}

describe('Datalist', function() {

	let object;
	let view;
	let doc;
	let browser;

	beforeEach(function() {
		browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass">
							<datalist id="data" data-class="MyList" data-display="text"></datalist>
							<input list="data" data-property="text" autofocus>
						</div>
		`);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.strictEqual(view.isVisible, false);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);

		view.show();

		// Populate
		object = new MyList();
		view.populate(MyList.name, object.getAll());

		// Should contain value
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isDirty, false);
		assert.strictEqual(view.isValid, true);
		let options = doc.querySelectorAll("datalist > option");
		assert.strictEqual(options.length, 2);
	});

	it('Should not change when populated with empty data', function() {
		view.show();
		let options = doc.querySelectorAll("datalist > option");

		view.populate(MyClass.name, null);
		assert.strictEqual(options.length, 0);

		view.populate(MyClass.name, '');
		assert.strictEqual(options.length, 0);
	});

	it('Should have a datalist', function() {
		let list = view.dataLists;
		assert.notStrictEqual(list, null);
		assert.strictEqual(list.count(), 1);
		assert.strictEqual(list.first(), MyList.name);
	});
});
