
const collect = require("collect.js");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const TestStore = require('./utils/TestStore.js').TestStore;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;
const TestProxy = require('./utils/TestProxy.js').TestProxy;

class TestController extends mvc.ListController {
	constructor(url, repo, view) {
		super(url, repo, view);
	}
}

class RelatedProxy extends mvc.CrudProxy {
	constructor(store) {
		super(store);
		this.testproxy_uid = null;
	}

	get filterBy() {
		return {testproxy_uid: this.testproxy_uid};
	}
}

describe('ListController', function() {
	let store;
	let repo;
	let view;
	let relatedView;
	let ctrl;
	let relatedCtrl;
	let router;
	let url;

	beforeEach(function() {
		url = 'https://example.org';
		store = new TestStore();
		store.update(TestProxy.name, {uid:1});
		store.update(TestProxy.name, {uid:2});
		store.update(RelatedProxy.name, {uid:1, testproxy_uid: 1});
		view = new TestMvcView();
		relatedView = new TestMvcView('/list/RelatedProxy?testproxy_uid=1');
		relatedView.classes.put(RelatedProxy.name, RelatedProxy.name);
		router = new mvc.Router(view.window);
		repo = new mvc.Repo();
		repo.add(new TestProxy(store));
		repo.add(new RelatedProxy(store));
		repo.add(router);
		ctrl = new TestController('/list/TestProxy', repo, view);
		relatedCtrl = new mvc.ListController('/list/RelatedProxy', repo, relatedView);
	});

	it('Should show data', function() {
		router.goto('/list/TestProxy');
		assert.strictEqual(ctrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, true);
		assert.strictEqual(view.values.count(), 1);
		assert.strictEqual(view.values.keys().first(), TestProxy.name);
		assert.strictEqual(view.values.get(TestProxy.name).objects.count(), 2);
		assert.strictEqual(view.location, url+'/list/TestProxy');
	});

	it('Should show related data with foreignkey', function() {
		router.goto('/list/RelatedProxy?testproxy_uid=1');
		assert.strictEqual(relatedCtrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, false);
		assert.strictEqual(relatedView.visible, true);
		assert.strictEqual(relatedView.values.count(), 1);
		assert.strictEqual(relatedView.values.keys().first(), RelatedProxy.name);
		assert.strictEqual(relatedView.values.get(RelatedProxy.name).testproxy_uid, 1);
		assert.strictEqual(view.location, url+'/list/RelatedProxy?testproxy_uid=1');
	});

	it('Should find data', function() {
		router.goto('/list/TestProxy');
		view.validateAndfire("find", false, new mvc.ElementValue(TestProxy.name, 'find', 1, null));
		assert.strictEqual(ctrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, true);
		assert.strictEqual(view.values.count(), 1);
		assert.strictEqual(view.values.keys().first(), TestProxy.name);
		assert.strictEqual(view.values.get(TestProxy.name).objects.count(), 2);
		assert.strictEqual(view.location, url+'/list/TestProxy');
	});

	it('Should delete data', function() {
		router.goto('/list/TestProxy');
		assert.strictEqual(view.values.get(TestProxy.name).objects.count(), 2);

		// Regret
		view.confirmAnswer = false;
		view.validateAndfire("delete", false, new mvc.ElementValue(TestProxy.name, 'delete', 1, null));
		assert.strictEqual(ctrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, true);
		assert.strictEqual(view.values.get(TestProxy.name).objects.count(), 2);

		// Confirm
		view.values = collect([]);
		view.confirmAnswer = true;
		view.validateAndfire("delete", false, new mvc.ElementValue(TestProxy.name, 'delete', 1, null));
		assert.strictEqual(ctrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, true);
		assert.strictEqual(view.values.get(TestProxy.name).objects.count(), 1);
		assert.strictEqual(view.location, url+'/list/TestProxy');
	});

	it('Should be a create url', function() {
		router.goto('/list/TestProxy');
		view.validateAndfire("create", false, new mvc.ElementValue(TestProxy.name, 'create', null, null));
		assert.strictEqual(ctrl.state, ctrl.states.start);
		assert.strictEqual(view.location, url+'/detail/TestProxy/new');
	});

	it('Should be an edit url', function() {
		router.goto('/list/TestProxy');
		view.validateAndfire("edit", false, new mvc.ElementValue(TestProxy.name, 'edit', 1, null));
		assert.strictEqual(ctrl.state, ctrl.states.start);
		assert.strictEqual(view.location, url+'/detail/TestProxy/1');
	});

	it('Should fail on proxy not found', function() {
		router.goto('/list/TestProxy');
		view.confirmAnswer = true;
		view.validateAndfire("delete", false, new mvc.ElementValue(TestProxy.name, 'delete', 10, null));
		assert.strictEqual(view.error.message, 'Object not found');
		assert.strictEqual(ctrl.state,ctrl.states.input);
	});
});