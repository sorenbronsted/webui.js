
const mvc = require('../../lib/src/mvc');
const assert = require('assert');
const TestObserver = require('./utils/TestObserver.js').TestObserver;

describe('Observer', function() {

	let observer;

	beforeEach(function() {
		observer = new TestObserver();
	});

	it('Should be called', function() {
		observer.handleEvent(new mvc.Event('me', 'test'));
		assert.strictEqual(observer.root.sender, 'me');
		assert.strictEqual(observer.root.name, 'test');
		assert.strictEqual(observer.root.body, null);
	});

	it('Should fail on none override', function() {
		let ob = new mvc.Observer();
		assert.throws(() => {
			ob.handleEvent(new mvc.Event('me', 'test'));
		}, /You must override handleEvent/);
	});
});

