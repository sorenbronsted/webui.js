
const assert = require('assert');
const collect = require('collect.js');
//const Subject = require('../../lib/src/mvc/Subject.js').Subject;
const Observer = require('../../lib/src/mvc/Observer.js').Observer;
const m = require('../../lib/src/menu');

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
			assert.ok(observer.root !=null);

			let menu = observer.root.getByUid(2);
			assert.strictEqual(menu.uri, '');

			menu = observer.root.getByUid(3);
			assert.strictEqual(menu.uri, '');
		});
	});

	it('Should set the parameters', () => {
		proxy.setParameter('/list/SomeClass/1?p1=117');
		proxy.populate();
		assert.ok(observer.root !=null);

		let menu = observer.root.getByUid(2);
		assert.strictEqual(menu.uri, '/params?p1=117');

		menu = observer.root.getByUid(3);
		assert.strictEqual(menu.uri, '/uid-param/1');
	});

	it('Should select a menu', () => {
		let uri = '/params?p1=117';
		proxy.setParameter(uri);
		proxy.select(uri);
		proxy.populate();
		assert.ok(observer.root !=null);

		collect([2,4,5]).each(uid => {
			let menu = observer.root.getByUid(uid);
			if (uid !== 5) {
				assert.strictEqual(menu.active, true, `${uid}`);
			}
			assert.strictEqual(menu.visible, true, `${uid}`);
		});

		collect([3,6,7]).each(uid => {
			let menu = observer.root.getByUid(uid);
			assert.strictEqual(menu.active, false, `${uid}`);
			assert.strictEqual(menu.visible, false, `${uid}`);
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
			assert.strictEqual(menu.active, false, `${uid}`);
			assert.strictEqual(menu.visible, false, `${uid}`);
		});
	});

});

describe('MenuProxy interface', () => {
	it('Should error', () => {
		assert.throws(() => new m.MenuProxy(), {message:/override/});
	});
});