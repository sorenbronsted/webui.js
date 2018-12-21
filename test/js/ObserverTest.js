
const mvc = require('../../lib/src/mvc');
const assert = require('assert');

describe('Observer', function() {

	let called;
	let observer;

	beforeEach(function() {
		called = 0;
		observer = new mvc.Observer();
		observer.addEventHandler('test', function() {
			called++;
		});
	});

	it('Should be called', function() {
		observer.handleEvent('me', 'test');
		assert.equal(called, 1);
	});

	it('Should not be called', function() {
		observer.handleEvent('me', 'test');
		observer.removeEventHandler('test');
		observer.handleEvent('me', 'test');
		assert.equal(called, 1);
	});
});

