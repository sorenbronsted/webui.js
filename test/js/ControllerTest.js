
const collect = require("collect.js");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const TestStore = require('./utils/TestStore.js').TestStore;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;
const TestProxy = require('./utils/TestProxy.js').TestProxy;

class TestController extends mvc.Controller {
}

describe('Controller', function() {
	let store;
	let repo;
	let view;
	let ctrl;
	let router;
	let url;

	beforeEach(function() {
		url = 'https://example.org';
		store = new TestStore();
		view = new TestMvcView();
		router = new mvc.Router(view.window);
		repo = new mvc.Repo();
		repo.add(new TestProxy(store));
		repo.add(router);
		ctrl = new TestController('/list/TestProxy', repo, view);
	});

	it('Should do CRUD workflow', function() {

		// Initial
		router.goto('/list/TestProxy');
		assert.equal(view.visible, true);
		assert.equal(store.objects.count(), 0);
		assert.notEqual(view.value, null);
		assert.equal(view.location, url+'/list/TestProxy');

		// Create
		router.goto('/list/TestProxy/new');
		assert.equal(view.visible, true);
		assert.notEqual(view.value, null);
		let object = view.value;
		assert.equal(object.uid, 0);
		assert.equal(object.name, undefined);
		assert.equal(view.location, url+"/list/TestProxy/new");

		// Save
		view.validateAndfire(view.eventPropertyChanged, false, new mvc.ElementValue(TestProxy.name, 'name', 0, 'test'));
		view.validateAndfire("save", false, new mvc.ElementValue(TestProxy.name, 'save', 0, null));
		assert.equal(store.objects.count(), 1);
		object = store.objects.get(TestProxy.name).get(1);
		assert.equal(object.uid, 1);
		assert.equal(object.name, 'test');
		assert.equal(view.location, url+"/list/TestProxy");

		// Edit
		router.goto('/list/TestProxy/1');
		assert.equal(view.visible, true);
		assert.equal(view.location, url+"/list/TestProxy/1");

		// Save
		view.validateAndfire(view.eventPropertyChanged, false, new mvc.ElementValue(TestProxy.name, 'name', 1, 'sletmig'));
		view.validateAndfire("save", false, new mvc.ElementValue(TestProxy.name, 'save', 1, null));
		assert.equal(store.objects.count(), 1);
		object = store.objects.get(TestProxy.name).get(1);
		assert.equal(object.uid, 1);
		assert.equal(object.name, 'sletmig');
		assert.equal(view.location, url+"/list/TestProxy");

		// Delete
		view.validateAndfire("delete", false, new mvc.ElementValue(TestProxy.name, 'delete', 1, null));
		assert.equal(store.objects.get(TestProxy.name).count(), 0);
		assert.equal(view.location, url+"/list/TestProxy");
	});

	it('Should fail on proxy not found', function() {
		router.goto('/list/TestProxy');
		try {
			view.validateAndfire("delete", false, new mvc.ElementValue(TestProxy.name, 'delete', 10, null));
			assert.fail('Expected an exception');
		}
		catch(error) {
			assert.equal(error.message,'TestProxy not found');
		}
	});
});