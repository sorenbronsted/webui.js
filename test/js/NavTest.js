
const collect = require('collect.js');
const assert = require('assert');
const m = require('../../lib/src/menu');
const mvc = require('../../lib/src/mvc');
const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestView = require('./utils/TestView').TestView;

class AppMenu extends m.MenuProxy {
	init(root) {
		// The uid must match data-uid in html
		let data = root.push(new m.Menu(1,'/menu/1'));
		data.push(new m.Menu(10,'/menu/10'));
		data = root.push(new m.Menu(2,'/menu/2'));
		data.push(new m.Menu(20,'/menu/20'));
	}
}

describe('Nav', function() {

	let browser;
	let doc;
	let menu;
	let ctrl;
	let view;
	let router;

	beforeEach(function() {
		browser = new TestBrowser();
		doc = browser.window.document;
		menu = new AppMenu();
		view = new TestView(browser.window,`
			<nav data-class="AppMenu">
				<a data-uid="1" data-property="url" data-type="menu">Menu 1</a>
				<a data-uid="2" data-property="url" data-type="menu">Menu 2</a>
				<nav>
					<a data-uid="10" data-property="url" data-type="menu">SubMenu 1.10</a>
				</nav>
				<nav>
					<a data-uid="20" data-property="url" data-type="menu">SubMenu 2.20</a>
				</nav>
			</nav>
		`);
		router = new mvc.Router(view.window);
		let currentViewState = new mvc.CurrentViewState();
		ctrl = new m.MenuCtrl(router, menu, view, currentViewState);
	});

	it('Should hide data-uid = 20', function() {
		assert.strictEqual(view._elements.count(), 1);

		view.show();
		assert.strictEqual(true, view.isVisible);

		router.goto('/menu/1');
		let fixtures = {
			'a[data-uid="1"]': null,
			'a[data-uid="2"]': null,
			'a[data-uid="10"]': null,
			'a[data-uid="20"]': '',
		};
		for (const key in fixtures) {
			let elem = doc.querySelector(key);
			assert.notStrictEqual(elem, null, key);
			assert.strictEqual(elem.getAttribute('hidden'), fixtures[key], key);
		}
	});

	it('Should hide data-uid = 10', function() {
		assert.strictEqual(view._elements.count(), 1);

		view.show();
		assert.strictEqual(true, view.isVisible);

		router.goto('/menu/20');
		fixtures = {
			'a[data-uid="1"]': null,
			'a[data-uid="2"]': null,
			'a[data-uid="10"]': '',
			'a[data-uid="20"]': null,
		};
		for (const key in fixtures) {
			let elem = doc.querySelector(key);
			assert.notStrictEqual(elem, null, key);
			assert.strictEqual(elem.getAttribute('hidden'), fixtures[key], key);
		}
	});
});