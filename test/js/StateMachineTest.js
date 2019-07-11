
const assert = require('assert');
const mvc = require('../../lib/src/mvc');

describe('StateMachine', function() {

	let event = null;
	let called = 0;
	let sm = null;

	beforeEach(function() {
		sm = new mvc.StateMachine(this);
		called = 0;
		event = null;
	});

	it('Should be called', function() {
		sm.add(new mvc.Transition('start', 'next', function(e) {
			event = e;
			called++;
		}));
		sm.run(new mvc.Event('me', 'test'));
		assert.strictEqual(sm.state, 'next');
		assert.strictEqual(called, 1);
		assert.notStrictEqual(event, null);
		assert.strictEqual(event.sender, 'me');
		assert.strictEqual(event.name, 'test');
		assert.strictEqual(event.body, null);
	});

	it('Should not be called', function() {
		sm.add(new mvc.Transition('start', 'next', function(e) {
			event = e;
			called++;
		}, function(e) {
			return false;
		}));
		sm.run(new mvc.Event('me', 'test'));
		assert.strictEqual(sm.state, 'start');
		assert.strictEqual(called, 0);
		assert.strictEqual(event, null);
	});

	it('Should not change state on exception', function() {
		try {
			sm.add(new mvc.Transition('start', 'next', function (e) {
				throw Error('Simulate error');
			}));
			sm.run(new mvc.Event('me', 'test'));
		}
		catch (e) {
			assert.strictEqual(sm.state, 'start');
			assert.strictEqual(called, 0);
			assert.strictEqual(event, null);
		}
	});

	it('Should serialize events', function() {
		sm.add(new mvc.Transition('start', 'start', function(e) {
			called++;
			if (called > 1) { // Prevent of going into infinite loop
				return;
			}
			sm.run(new mvc.Event('me', 'test2'));
			assert.strictEqual(called, 1);
		}));
		sm.run(new mvc.Event('me', 'test1'));
		assert.strictEqual(called, 2);
	});
});