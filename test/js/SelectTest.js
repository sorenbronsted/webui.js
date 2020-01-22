
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
		super.add(JSON.parse('{"class":"MyClass","uid":1,"value_uid":2}'));
	}
}

class MyList extends mvc.BaseProxy {
	constructor() {
		super();
		super.addAll(collect(JSON.parse('[{"class":"MyList","uid":1,"text":"load 1"},{"class":"MyList","uid":2,"text":"load 2"}]')));
	}
}

describe('Select', function() {

	let view;
	let doc;

	beforeEach(function() {
		let browser = new TestBrowser();
		view = new TestView(browser.window,
			`<div data-class="MyClass"><select data-property="value_uid" data-list="MyList" data-list-display="text"></select></div>`);
		doc = browser.window.document;
	});

	it('Should contain a value on populate', function() {
		// Initial should be empty
		assert.strictEqual(view.isVisible, false);
		assert.strictEqual(view.isValid, true);

		view.show();
		let select = doc.querySelector("select");
		assert.strictEqual(select.value, '');
		assert.strictEqual(select.length, 0);
		assert.strictEqual(select.selectedIndex, -1);

		// Populate
		let object = new MyClass();
		let list = new MyList();

		// The order of populate will ensure that select gets the proper value
		view.populate(MyList.name, list.getAll());
		view.populate(MyClass.name, object.get(1));

		// Should contain value
		assert.strictEqual(view.isVisible, true);
		assert.strictEqual(view.isValid, true);

		assert.strictEqual(select.length, 2);
		assert.strictEqual(select.value, '2');
	});

	it('Should not change when populated with empty data', function() {
		view.show();

		let object = new MyClass();
		let list = new MyList();
		view.populate(MyList.name, list.getAll());
		view.populate(MyClass.name, object.get(1));

		let select = doc.querySelector("select");
		assert.strictEqual(select.value, '2');

		view.populate(MyClass.name, null);
		assert.strictEqual(select.value, '2');

		view.populate(MyClass.name, '');
		assert.strictEqual(select.value, '2');
	});

	it('Should have a datalist', function() {
		let list = view.dataLists;
		assert.notStrictEqual(list, null);
		assert.strictEqual(list.count(), 1);
		assert.strictEqual(list.first(), MyList.name);
	});

	it('Should be valid on focus', function() {
		view.show();
		let elem = doc.querySelector("select");
		elem.focus();
		assert.strictEqual(view.isValid, true);
	});

	it('Should be dirty on change', function() {
		view.show();
		let elem = doc.querySelector("select");
		let e = doc.createEvent('HTMLEvents');
		e.initEvent('change', false, true);
		elem.dispatchEvent(e);
		assert.strictEqual(view.events.count(), 2);
		assert.strictEqual(view.events.get(0).name, view.eventPropertyChanged);
		assert.strictEqual(view.events.get(0).body.property, 'isDirty');
		assert.strictEqual(view.events.get(0).body.value, true);
		assert.strictEqual(view.events.get(1).name, view.eventPropertyChanged);
	});
});
