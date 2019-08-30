const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const assert = require('assert');

class MyClass extends mvc.BaseProxy {
	constructor() {
		super();
		this.someProperty = null;
		this.otherProperty = null;
	}

	get properties() {
		return {someProperty:this.someProperty};
	}

	set somePropertyByElement(element) {
		this.someProperty = element.value;
	}
}

describe('BaseProxy', function() {
	let serverResult;
	let proxy;

	describe('#add', function() {
		beforeEach(function() {
			serverResult = JSON.parse('{"MyClass":{"uid":1,"name":"load"}}'); // Simulate server result
			proxy = new MyClass();
		});

		it('Should exists', function() {
			proxy.add(serverResult);
			assert(proxy.size() === 1);
		});

		it('Should be the same', function() {
			proxy.add(serverResult);
			let o = proxy.get(1);
			assert(o !== undefined);
			assert(o.uid === 1);
			assert(o.name === 'load');
			assert(proxy.has(1) === true)
		});

		it('Should fail on different class', function() {
			assert.throws(() => { proxy.add({}) },/same class/);
		});

		it('Should fail on missing uid', function() {
			assert.throws(() => { proxy.add({MyClass:{}}) },/must have .* uid/);
		});
	});

	describe('#addAll', function() {
		beforeEach(function() {
			serverResult = collect(JSON.parse('[{"MyClass":{"uid":1,"name":"test1"}},{"MyClass":{"uid":2,"name":"test2"}}]')); // Simulate server result
			proxy = new MyClass();
		});

		it('Should exists', function() {
			proxy.addAll(serverResult);
			assert.strictEqual(proxy.size(), 2);
		});

		it('Should be same size', function() {
			proxy.addAll(serverResult);
			let size = 0;
			proxy.getAll().objects.each(o => {
				assert(o !== undefined);
				assert(o.uid === size + 1); // Uses size to simulate uids
				size++;
			});
			assert(size === 2);
			assert(proxy.size() === size);
		});
	});

	describe('#remove', function() {
		beforeEach(function() {
			serverResult = JSON.parse('{"MyClass":{"uid":1,"name":"load"}}'); // Simulate server result
			proxy = new MyClass();
		});

		it('Should end on zero', function() {
			proxy.add(serverResult);
			assert(proxy.size() === 1);
			proxy.remove(1);
			assert(proxy.size() === 0);
		});
	});

	describe('#setProperty', function() {
		beforeEach(function() {
			serverResult = JSON.parse('{"MyClass":{"uid":1,"name":"load"}}'); // Simulate server result
			proxy = new MyClass();
		});

		it('Should exists and set a property', function() {
			proxy.add(serverResult);
			proxy.setPropertyByElement(new mvc.ElementValue(MyClass.name, 'name', 1, 'test2'));
			let o = proxy.get(1);
			assert(undefined !== o);
			assert('test2' === o.name);
		});

		it('Should set someProperty via setPropertyByElement', function() {
			assert.strictEqual(proxy.someProperty, null);
			proxy.setPropertyByElement(new mvc.ElementValue(MyClass.name,'someProperty', undefined, 'someValue'));
			assert.strictEqual(proxy.someProperty, 'someValue');
		});

		it('Should set otherProperty via setPropertyByElement', function() {
			assert.strictEqual(proxy.otherProperty, null);
			proxy.setPropertyByElement(new mvc.ElementValue(MyClass.name,'otherProperty', undefined, 'someValue'));
			assert.strictEqual(proxy.otherProperty, 'someValue');
		});

		it('Should set someProperty via setProperty', function() {
			assert.strictEqual(proxy.someProperty, null);
			proxy.setProperty('someProperty', 'someValue');
			assert.strictEqual(proxy.someProperty, 'someValue');
		});

		it('Should fail on property not found on object', function() {
			let elementValue = new mvc.ElementValue(MyClass.name, 'my', 2, 'test2');
			assert.throws(() => { proxy.setPropertyByElement(elementValue) },/Cannot set property 'my' of null/);
		});

		it('Should fail on property via setPropertyByElement', function() {
			let elementValue = new mvc.ElementValue(MyClass.name, 'my', undefined, 'test2');
			assert.throws(() => { proxy.setPropertyByElement(elementValue) },/Property not found: my/);
		});

		it('Should fail on property via setProperty', function() {
			assert.throws(() => { proxy.setProperty('my', 'test') },/Property not found: my/);
		});

		it('Should return properties', function() {
			proxy.setPropertyByElement(new mvc.ElementValue(MyClass.name,'someProperty', undefined, 'someValue'));
			assert.strictEqual(proxy.someProperty, 'someValue');
			assert(proxy.properties, {someProperty:'someValue'});
		});
	});

	describe('#get', function() {
		beforeEach(function () {
			proxy = new MyClass();
		});

		it('Should fail on object not found', function() {
			assert.throws(() => { proxy.get(1) },/Object not found: 1/);
		});

	});

	describe('#getAll', function() {
		beforeEach(function () {
			serverResult = collect(JSON.parse('[{"MyClass":{"uid":1,"name":"test1"}},{"MyClass":{"uid":2,"name":"test2"}}]')); // Simulate server result
			proxy = new MyClass();
		});

		it('Should be sorted asc', function() {
			let objects = proxy.getAll().objects;
			let uid = 1;
			objects.each(item => {
				assert.strictEqual(itme.uid, uid);
				uid++;
			});
		});


		it('Should be sorted desc', function() {
			proxy.sortAsc = false;
			let objects = proxy.getAll().objects;
			let uid = 2;
			objects.each(item => {
				assert.strictEqual(itme.uid, uid);
				uid--;
			});
		});

	});
});

