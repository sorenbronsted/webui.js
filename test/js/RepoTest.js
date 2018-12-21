
const assert = require('assert');
const mvc = require('../../lib/src/mvc');

describe('Proxy', function() {
	describe('add and get', function () {
		let repo = new mvc.Repo();
		let object = {'uid':1};

		repo.add(object);

		it('Should get the same object', function() {
			let object2 = repo.get(object.constructor.name);
			assert.equal(object.uid, object2.uid);
		});

		it('Should fail', function() {
			assert.throws(() => {repo.get('x');});
		});
	});
});
