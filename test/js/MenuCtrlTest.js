
const assert = require('assert');
const collect = require('collect.js');
const Router = require('../../lib/src/mvc/Router.js').Router;
const TestBrowser = require('./utils/TestBrowser.js').TestBrowser;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;
const m = require('../../lib/src/menu');

class TestProxy extends m.MenuProxy {
	_populate(root) {
		let child = root.push(new m.Menu(2,'/params', 'p1'));
		child.push(new m.Menu(4, '/child4'));
		child.push(new m.Menu(5, '/child5'));
		child = root.push(new m.Menu(3,'/uid-param', 'uid'));
		child.push(new m.Menu(6, '/child6'));
		child.push(new m.Menu(7, '/child7'));
	}
}

describe('MenuCtrl', function() {

	let router;
	let ctrl;
	let uri;

	beforeEach(() => {
		let view = new TestMvcView();
		router = new Router(view);
		let proxy = new TestProxy();
		ctrl = new m.MenuCtrl(router, proxy, view);
	});

	it('Should handle router events', () => {
		//TODO router.goto(uri+'/params?p1=a');
	});
});
