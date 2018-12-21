const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const TestStore = require('./utils/TestStore.js').TestStore;
const TestObserver = require('./utils/TestObserver.js').TestObserver;
const assert = require('assert');

class MyClass extends mvc.BaseProxy {}

describe('BaseProxy', function() {
	describe('#add', function() {
		let serverResult;
		let proxy;

		beforeEach(function() {
			serverResult = JSON.parse('{"MyClass":{"uid":1,"name":"load"}}'); // Simulate server result
			proxy = new MyClass();
		});

		it('Should exists', function() {
			proxy.add(serverResult);
			assert.equal(proxy.size(), 1);
		});

		it('Should be the same', function() {
			proxy.add(serverResult);
			let o = proxy.get(1);
			assert.notEqual(o, undefined);
			assert.equal(o.uid, 1);
			assert.equal(o.name, 'load');
		});
	});

	describe('#addAll', function() {
		let serverResult;
		let proxy;

		beforeEach(function() {
			serverResult = collect(JSON.parse('[{"MyClass":{"uid":1,"name":"test1"}},{"MyClass":{"uid":2,"name":"test2"}}]')); // Simulate server result
			proxy = new MyClass();
		});

		it('Should exists', function() {
			proxy.addAll(serverResult);
			assert.equal(proxy.size(), 2);
		});

		it('Should be same size', function() {
			proxy.addAll(serverResult);
			let size = 0;
			proxy.getAll().each(o => {
				assert.notEqual(o, undefined);
				assert.equal(o.uid, size + 1); // Uses size to simulate uids
				size++;
			});
			assert.equal(size, 2);
			assert.equal(proxy.size(), size);
		});
	});

	describe('#remove', function() {
		beforeEach(function() {
			serverResult = JSON.parse('{"MyClass":{"uid":1,"name":"load"}}'); // Simulate server result
			proxy = new MyClass();
		});

		it('Should end on zero', function() {
			proxy.add(serverResult);
			assert.equal(proxy.size(), 1);
			proxy.remove(1);
			assert.equal(proxy.size(), 0);
		});
	});

	describe('#setProperty', function() {
		beforeEach(function() {
			serverResult = JSON.parse('{"MyClass":{"uid":1,"name":"load"}}'); // Simulate server result
			proxy = new MyClass();
		});

		it('Should exists', function() {
			proxy.add(serverResult);
			proxy.setProperty(new mvc.ElementValue(MyClass.name, 'name', 1, 'test2'));
			let o = proxy.get(1);
			assert.notEqual(o, undefined);
			assert.equal('test2', o.name);
		});
	});
});

