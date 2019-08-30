
const mvc = require('../../lib/src/mvc');
const assert = require('assert');
const TestObserver = require('./utils/TestObserver.js').TestObserver;

describe('Subject', function() {
	let observer;
	let subject;

	beforeEach(function() {
		observer = new TestObserver();
		subject = new mvc.Subject();
	});

	// Should be added once
	it('Should return 1 when handled', function() {
		subject.addEventListener(observer);
		subject.addEventListener(observer);
		subject.fire(new mvc.Event());
		assert.notStrictEqual(observer.root, null);
	});

	it('Should cope with removal twice', function() {
		subject.addEventListener(observer);
		subject.removeEventListener(observer);
		subject.removeEventListener(observer);
		subject.fire(new mvc.Event());
		assert.strictEqual(observer.root, null);
	});

	it('Should be called', function() {
		subject.addEventListener(observer);
		subject.fire(new mvc.Event());
		assert.notStrictEqual(observer.root, null);
	});

	it('Should not be called', function() {
		subject.addEventListener(observer);
		subject.removeEventListener(observer);
		subject.fire(new mvc.Event());
		assert.strictEqual(observer.root, null);
	});

	it('Should serialize events', function() {
		subject.addEventListener(observer);
		subject.fire(new mvc.Event());
	});
});

