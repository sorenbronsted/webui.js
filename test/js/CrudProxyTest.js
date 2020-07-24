
const assert= require('assert');
const mvc = require('../../lib/src/mvc');
const TestStore = require('./utils/TestStore.js').TestStore;
const TestObserver = require('./utils/TestObserver.js').TestObserver;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;

describe('CrudProxy', function() {
	let repo;
	let observer;
	let store;

	beforeEach(function() {
		store = new TestStore();
		let view = new TestMvcView();
		repo = new mvc.Repo();
		repo.add(new mvc.Router(view.window));
		repo.add(new mvc.CrudProxy(store));
		observer = new TestObserver(repo);
	});

	it('Should create data', function () {
		let proxy = repo.get(mvc.CrudProxy.name);
		proxy.create();
		assert.strictEqual(observer.root.sender, mvc.CrudProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.strictEqual(observer.root.body.uid, 0);
		assert.strictEqual(proxy.get(0).uid, 0);
	});

	it('Should update data', function () {
		let proxy = repo.get(mvc.CrudProxy.name);
		proxy.create();
		proxy.update(0);
		assert.strictEqual(observer.root.sender, mvc.CrudProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.strictEqual(observer.root.body, null);
		assert.strictEqual(proxy.store.objects.count(), 1);
		assert.strictEqual(proxy.store.objects.get(mvc.CrudProxy.name).get(1).uid, 1);
	});

	it('Should read data', function() {
		let proxy = repo.get(mvc.CrudProxy.name);
		proxy.create();
		proxy.update(0);

		proxy.read(0);
		assert.strictEqual(observer.root.sender, mvc.CrudProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.notStrictEqual(observer.root.body, null);

		proxy.read();
		assert.strictEqual(observer.root.sender, mvc.CrudProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.notStrictEqual(observer.root.body, null);
	});

	it('Should delete data', function() {
		let proxy = repo.get(mvc.CrudProxy.name);
		proxy.create();
		proxy.update(0);
		proxy.delete(1);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.strictEqual(observer.root.sender, mvc.CrudProxy.name);
		assert.strictEqual(observer.root.body, null);
	});

	it('Should read test data', function() {
		store.update(mvc.CrudProxy.name, {uid:101,name:'test'});
		let proxy = repo.get(mvc.CrudProxy.name);
		proxy.read(101);
		assert.strictEqual(observer.root.sender, mvc.CrudProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.notStrictEqual(observer.root.body, 'test');
	});

	it('Should fail', function() {
		store.triggerError = true;
		let proxy = repo.get(mvc.CrudProxy.name);
		proxy.read();
		assert.strictEqual(observer.root.body.message,'Simulated error');
		proxy.read(1);
		assert.strictEqual(observer.root.body.message,'Simulated error');
		assert.throws(() => { proxy.update(1) },/Object not found: 1/);
		proxy.delete();
		assert.strictEqual(observer.root.body.message,'Simulated error');
	});
});
