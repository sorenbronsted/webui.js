
const assert = require('assert');
const collect = require('collect.js');
const m = require('../../lib/src/menu');

describe('Menu', function() {

	let root;

	beforeEach(() => {
		root = new m.Menu(1, '/');
		root.push(new m.Menu(2,'/no-params'));
		root.push(new m.Menu(3,'/params', 'p1'));
		let child = root.push(new m.Menu(4,'/uid', 'uid'));
		child.push(new m.Menu(5, 'child1'));
		child.push(new m.Menu(6, 'child2'));
	});

	it('It should not be active', () => {
		assert.strictEqual(root.active, false);
	});

	it('It should not be visible', () => {
		assert.strictEqual(root.visible, false);
	});

	it('It should return and uri', () => {
		assert.strictEqual(root.uri, '/');

		let noParams = root.getByUid(2);
		assert.strictEqual(noParams.uri, '/no-params');
	});

	it('Should return an uri with parameters', () => {
		let params = root.getByUid(3);
		assert.strictEqual(params.uri, '');

		root.setParameter(collect({'p1':'me'}));
		assert.strictEqual(params.uri, '/params?p1=me');

		root.setParameter(collect({'uid':1}));
		params = root.getByUid('4');
		assert.strictEqual(params.uri, '/uid/1');
	});

	it('Should be selected', () => {
		root.setParameter(collect({'uid':1}));
		root.select('/uid/1');
		let menu = root.getByUid(4);
		assert.strictEqual(menu.active, true);
		assert.strictEqual(root.active, false);

		menu = root.getByUid(5);
		assert.strictEqual(menu.active, true);

		menu = root.getByUid(6);
		assert.strictEqual(menu.active, false);
	});

	it('Should have a match', () => {
		let answer = root.hasMatch('/no-params');
		assert.strictEqual(answer, true);

		root.setParameter(collect({'p1':'a'}));
		answer = root.hasMatch('/params?p1=a');
		assert.strictEqual(answer, true);

		answer = root.hasMatch('/no-match');
		assert.strictEqual(answer, false);
	});

	it('Should not be visible', () => {
		root.select('/');
		assert.strictEqual(false, root.visible)
	});

	it('Should be visible', () => {
		root.select('/no-params');
		root.ensureVisible();

		let menu = root.getByUid(2);
		assert.strictEqual(true, menu.active);
		assert.strictEqual(true, menu.visible);
	});

	it('Should be visible with children', () => {
		root.setParameter(collect({'uid':1}));
		root.select('/uid/1');
		root.ensureVisible();

		let menu = root.getByUid(4);
		assert.strictEqual(true, menu.active);
		assert.strictEqual(true, menu.visible);

		collect([5,6]).each(uid => {
			let child = root.getByUid(uid);
			assert.strictEqual(true, menu.active);
			assert.strictEqual(true, menu.visible);
		});
	});

	it('Should not be visible with children', () => {
		root.setParameter(collect({'uid':1}));
		//root.select('/uid/1');
		root.ensureVisible();

		let menu = root.getByUid(4);
		assert.strictEqual(false, menu.active);
		assert.strictEqual(false, menu.visible);

		collect([5,6]).each(uid => {
			let child = root.getByUid(uid);
			assert.strictEqual(false, menu.active);
			assert.strictEqual(false, menu.visible);
		});
	});

	it('Should be reset to default values', () => {
		root.setParameter(collect({'uid': 1}));
		root.select('/uid/1');
		root.ensureVisible();
		let menu = root.getByUid(4);
		assert.strictEqual(true, menu.active);
		assert.strictEqual(true, menu.visible);

		menu.reset();
		assert.strictEqual(false, menu.active);
		assert.strictEqual(false, menu.visible);
	});
});