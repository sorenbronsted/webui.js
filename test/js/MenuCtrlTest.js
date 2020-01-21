
const assert = require('assert');
const collect = require('collect.js');
const Router = require('../../lib/src/mvc/Router.js').Router;
//const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;
const MenuProxy = require('../../lib/src/menu/MenuProxy.js').MenuProxy;
const MenuCtrl = require('../../lib/src/menu/MenuCtrl.js').MenuCtrl;
const Menu = require('../../lib/src/menu/Menu.js').Menu;
const ElementValue = require('../../lib/src/mvc/ElementValue.js').ElementValue;
const CurrentViewState = require('../../lib/src/mvc/CurrentViewState.js').CurrentViewState;

class TestProxy extends MenuProxy {
	init(root) {
		let child = root.push(new Menu(2,'/params', 'p1'));
		child.push(new Menu(4, '/child4'));
		child.push(new Menu(5, '/child5'));
		child = root.push(new Menu(3,'/uid-param', 'uid'));
		child.push(new Menu(6, '/child6'));
		child.push(new Menu(7, '/child7'));
	}
}

describe('MenuCtrl', function() {

	let router;
	let ctrl;
	let view;
	let uri = 'http://somewhere.net/';
	let currentViewState = new CurrentViewState();

	beforeEach(() => {
		view = new TestMvcView(uri);
		router = new Router(view.window);
		currentViewState = new CurrentViewState();
		ctrl = new MenuCtrl(router, new TestProxy(), view, currentViewState);
	});

	it('Should handle router events', function() {
		assert.strictEqual(view.values.count(), 0);
		router.goto(uri+'/params?p1=a');
		assert.strictEqual(view.values.count() , 1);
	});

	it('Should handle view events', function() {
		assert.strictEqual(view.location, uri);
		view.validateAndfire(view.eventClick, false, new ElementValue(null, null, null, 'test'));
		assert.strictEqual(view.location, uri+'test');
	});

	it('Should handle dirty view', function() {
		currentViewState.setPropertyByElement(new ElementValue(null, 'isDirty', null, true));
		assert.strictEqual(view.location, uri);
		view.validateAndfire(view.eventClick, false, new ElementValue(null, null, null, 'test'));
		assert.strictEqual(view.location, uri);
	});
});
