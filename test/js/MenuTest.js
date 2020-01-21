
const assert = require('assert');
const collect = require('collect.js');
const m = require('../../lib/src/menu');

describe('Menu', function() {

	let root;

	/* Menu structure
	0 (root)
	+--+--+
	2  3  4
	      +--+
	      5  6
	*/

	beforeEach(() => {
		root = new m.Menu(0, '/');
		root.push(new m.Menu(2,'/no-params'));
		root.push(new m.Menu(3,'/params', 'p1'));
		let child = root.push(new m.Menu(4,'/detail/SomeProxy', 'uid'));
		child.push(new m.Menu(5, 'child1'));
		child.push(new m.Menu(6, 'child2'));
	});

	it('It should not be visible', () => {
		assert.strictEqual(root.visible, false);
	});

	it('It should return and uri', () => {
		assert.strictEqual(root.url, '/');

		let noParams = root.getByUid(2);
		assert.strictEqual(noParams.url, '/no-params');
	});

	it('Should return an uri with parameters', () => {
		let params = root.getByUid(3);
		assert.strictEqual(params.url, '');

		root.setParameter(collect({'p1':'me'}));
		assert.strictEqual(params.url, '/params?p1=me');

		root.setParameter(collect({proxy:'SomeProxy', uid:1}));
		params = root.getByUid('4');
		assert.strictEqual(params.url, '/detail/SomeProxy/1');
	});

	it('Should be selected', () => {
		root.setParameter(collect({proxy:'SomeProxy', 'uid':1}));
		root.select('/detail/SomeProxy/1');
		let menu = root.getByUid(4);
		assert.strictEqual(menu.selected, true);

		menu = root.getByUid(5);
		assert.strictEqual(menu.selected, true);

		menu = root.getByUid(6);
		assert.strictEqual(menu.selected, false);
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
		assert.strictEqual(root.visible, false)
	});

	it('Should be visible', () => {
		root.select('/no-params');
		root.ensureVisible();

		let menu = root.getByUid(2);
		assert.strictEqual(menu.selected, true);
		assert.strictEqual(menu.visible, true);
	});

	it('Should be visible with children', () => {
		root.setParameter(collect({proxy:'SomeProxy', uid:1}));
		root.select('/detail/SomeProxy/1');
		root.ensureVisible();

		let menu = root.getByUid(4);
		assert.strictEqual(menu.selected, true);
		assert.strictEqual(menu.visible, true);

		collect([5,6]).each(uid => {
			let child = root.getByUid(uid);
			assert.strictEqual(child.selected, (uid === 5), uid);
			assert.strictEqual(child.visible, true);
		});
	});

	it('Should not be visible with children', () => {
		root.setParameter(collect({'uid':1}));
		//root.select('/uid/1');
		root.ensureVisible();

		let menu = root.getByUid(4);
		assert.strictEqual(menu.selected, false);
		assert.strictEqual(menu.visible, true);

		collect([5,6]).each(uid => {
			let child = root.getByUid(uid);
			assert.strictEqual(child.selected, false);
			assert.strictEqual(child.visible, false);
		});
	});

	it('Should be reset to default values', () => {
		root.setParameter(collect({proxy:'SomeProxy', uid: 1}));
		root.select('/detail/SomeProxy/1');
		root.ensureVisible();
		let menu = root.getByUid(5);
		assert.strictEqual(menu.selected, true);
		assert.strictEqual(menu.visible, true);

		menu.reset();
		assert.strictEqual(menu.selected, false);
		assert.strictEqual(menu.visible, false);
	});
});