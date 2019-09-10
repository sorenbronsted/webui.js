
const assert = require('assert');
const collect = require('collect.js');
const Observer = require('../../lib/src/mvc/Observer.js').Observer;
const MenuProxy = require('../../lib/src/menu/MenuProxy.js').MenuProxy;
const Menu = require('../../lib/src/menu/Menu.js').Menu;

class TestObserver extends Observer {
	constructor(subject) {
		super();
		this.root = null;
		subject.addEventListener(this);
	}

	handleEvent(event) {
		this.root = event.body;
	}
}

class TestProxy extends MenuProxy {
	_populate(root) {
		let child = root.push(new Menu(2,'/params', 'p1'));
		child.push(new Menu(4, '/child4'));
		child.push(new Menu(5, '/child5'));
		child = root.push(new Menu(3,'/detail/SomeProxy', 'uid'));
		child.push(new Menu(6, '/child6'));
		child.push(new Menu(7, '/child7'));
	}
}

describe('MenuProxy', function() {

	let proxy;
	let observer;

	beforeEach(() => {
		proxy = new TestProxy();
		observer = new TestObserver(proxy);
	});

	it('Should not set any parameters', () => {
		collect(['', '/A?aa=117']).each(uri => {
			proxy.setParameter(uri);
			proxy.populate();
			assert.ok(observer.root != null);

			let menu = observer.root.getByUid(2);
			assert.strictEqual(menu.uri, '');

			menu = observer.root.getByUid(3);
			assert.strictEqual(menu.uri, '');
		});
	});

	it('Should set the parameters', () => {
		proxy.setParameter('/list/SomeProxy/1?p1=117');
		proxy.populate();
		assert.ok(observer.root !=null);

		let menu = observer.root.getByUid(2);
		assert.strictEqual(menu.uri, '/params?p1=117');

		menu = observer.root.getByUid(3);
		assert.strictEqual(menu.uri, '/detail/SomeProxy/1');
	});

	it('Should select a menu', () => {
		let uri = '/params?p1=117';
		proxy.setParameter(uri);
		proxy.select(uri);
		proxy.populate();
		assert.ok(observer.root !=null);

		collect([2,4,5]).each(uid => {
			let menu = observer.root.getByUid(uid);
			if (uid === 5) {
				assert.strictEqual(menu.selected, false, uid);
			}
			else {
				assert.strictEqual(menu.selected, true, uid);
			}
			assert.strictEqual(menu.visible, true, uid);
		});

		collect([3,6,7]).each(uid => {
			let menu = observer.root.getByUid(uid);
			assert.strictEqual(menu.selected, false, uid);
			assert.strictEqual(menu.visible, false, uid);
		});
	});

	it('Should not select a menu', () => {
		let uri = '/some/strange/uri/with/lots/of/segments';
		proxy.setParameter(uri);
		proxy.select(uri);
		proxy.populate();
		assert.ok(observer.root !=null);

		collect([3,4,5,6,7]).each(uid => {
			let menu = observer.root.getByUid(uid);
			assert.strictEqual(menu.selected, false, uid);
			assert.strictEqual(menu.visible, false, uid);
		});
	});

});

describe('MenuProxy interface', () => {
	it('Should error', () => {
		assert.throws(() => new MenuProxy(), {message:/override/});
	});
});