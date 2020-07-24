const assert= require('assert');
const mvc = require('../../lib/src/mvc');
const TestStore = require('./utils/TestStore.js').TestStore;
const TestStaticObserver = require('./utils/TestStaticObserver.js').TestStaticObserver;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;

describe('StaticProxy', function() {
	let repo;
	let observer;
	let store;

	beforeEach(function() {
		store = new TestStore();
		let view = new TestMvcView();
		repo = new mvc.Repo();
		repo.add(new mvc.Router(view.window));
		repo.add(new mvc.StaticProxy(store));
		observer = new TestStaticObserver(repo);
	});

	it('Should respond to reads with no instances', function() {
		let proxy = repo.get(mvc.StaticProxy.name);
		proxy.read();
		assert.strictEqual(observer.root.sender, mvc.StaticProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventFail);
		assert.notStrictEqual(observer.root.body.message, 'no instances found');
	});

	it('Should read data', function() {
		let proxy = repo.get(mvc.StaticProxy.name);
		proxy.add({uid: 1, name: 'test', class: mvc.StaticProxy.name});
		proxy.read(1);
		assert.strictEqual(observer.root.sender, mvc.StaticProxy.name);
		assert.strictEqual(observer.root.name, proxy.eventOk);
		assert.notStrictEqual(observer.root.body, null);
	});

	it('Should fail', function() {
		store.triggerError = true;
		let proxy = repo.get(mvc.StaticProxy.name);
		proxy.read(1);
		assert.strictEqual(observer.root.body.message,'Simulated error');
	});
});
