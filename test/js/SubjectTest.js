
const mvc = require('../../lib/src/mvc');
const assert = require('assert');

describe('Subject', function() {
	let called;
	let observer;
	let subject;

	beforeEach(function() {
		called = 0;
		observer = new mvc.Observer();
		observer.addEventHandler('test', function() {
			called++;
		});
		subject = new mvc.Subject();
	});

	// Should be added once
	it('should return 1 when handled', function() {
		subject.addEventListener(observer);
		subject.addEventListener(observer);
		subject.fire('test');
		assert.equal(called, 1);
	});

	it('Should cope with removal twice', function() {
		subject.addEventListener(observer);
		subject.removeEventListener(observer);
		subject.removeEventListener(observer);
		subject.fire('test');
		assert.equal(called, 0);
	});

	it('Should be called', function() {
		subject.addEventListener(observer);
		subject.fire('test');
		assert.equal(called, 1);
	});

	it('Should not be called', function() {
		subject.addEventListener(observer);
		subject.removeEventListener(observer);
		subject.fire('test');
		assert.equal(called, 0);
	});
});

