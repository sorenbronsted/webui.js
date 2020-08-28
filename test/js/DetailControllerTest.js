
const collect = require("collect.js");
const assert = require('assert');
const mvc = require('../../lib/src/mvc');
const TestStore = require('./utils/TestStore.js').TestStore;
const TestMvcView = require('./utils/TestMvcView.js').TestMvcView;
const TestProxy = require('./utils/TestProxy.js').TestProxy;

class TestController extends mvc.DetailController {
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
		return {testproxy_uid:this.testproxy_uid};
	}
}

class DataListProxy extends mvc.CrudProxy {
	constructor(store) {
		super(store);
	}
}

describe('DetailController', function() {
	let store;
	let repo;
	let view;
	let ctrl;
	let router;
	let url;

	beforeEach(function() {
		url = 'https://example.org';
		store = new TestStore();
		store.update(TestProxy.name, {uid:1});
		store.update(TestProxy.name, {uid:2});
		view = new TestMvcView();

		view.classes.put(RelatedProxy.name, RelatedProxy.name);
		view.dataLists.put(DataListProxy.name, DataListProxy.name);

		router = new mvc.Router(view.window);
		repo = new mvc.Repo();
		repo.add(new mvc.CurrentViewState());
		repo.add(new TestProxy(store));
		repo.add(new RelatedProxy(store));
		repo.add(new DataListProxy(store));
		repo.add(router);
		ctrl = new TestController('/detail/TestProxy', repo, view);
	});

	it('Should show', function() {
		router.goto('/detail/TestProxy/1');
		assert.strictEqual(ctrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, true);
		assert.notStrictEqual(view.value, null);
		assert.strictEqual(view.values.keys().count(), 3); // Objects read TestProxy, DataListProxy and RelatedProxy
		collect([TestProxy.name, DataListProxy.name, RelatedProxy.name]).each(name => {
			assert.strictEqual(view.values.has(name), true); // Objects read TestProxy, DataListProxy and RelatedProxy
		});
		assert.strictEqual(view.values.get(RelatedProxy.name).testproxy_uid,1);

		assert.strictEqual(view.location,url+'/detail/TestProxy/1');
	});

	it('Should show new', function() {
		router.goto('/detail/TestProxy/new');
		assert.strictEqual(ctrl.state, ctrl.states.input);
		assert.strictEqual(view.visible, true);
		assert.notStrictEqual(view.value, null);
		assert.strictEqual(view.values.keys().count(), 3);
		collect([TestProxy.name, DataListProxy.name]).each(name => {
			assert.strictEqual(view.values.has(name), true); // Objects read TestProxy, DataListProxy and RelatedProxy
		});
		assert.strictEqual(view.location,url+'/detail/TestProxy/new');
	});

	it('Should save', function() {
		store.update(TestProxy.name, {uid:1,name:'test'});
		router.goto('/detail/TestProxy/1');
		assert.strictEqual(ctrl.state, ctrl.states.input);
		view.validateAndfire("save", false, new mvc.ElementValue(TestProxy.name, 'save', 1, null));
		assert.strictEqual(ctrl.state,ctrl.states.start);
		assert.strictEqual(view.location, url+'/');
	});

	it('Should cancel', function() {
		router.goto('/detail/TestProxy/1');
		assert.strictEqual(ctrl.state, ctrl.states.input);
		view.validateAndfire("cancel", false, new mvc.ElementValue(TestProxy.name, 'cancel', 0, null));
		assert.strictEqual(ctrl.state, ctrl.states.start);
		assert.strictEqual(view.location, url+'/');
	});

	it('Should navigate away eg back button', function() {
		router.goto('/detail/TestProxy/1');
		assert.strictEqual(ctrl.state,ctrl.states.input);
		router.goto('/list/TestProxy');
		assert.strictEqual(ctrl.state,ctrl.states.start);
		assert.strictEqual(view.location,url+'/list/TestProxy');
	});

	it('Should cancel with changed data', function() {
		router.goto('/detail/TestProxy/1');
		assert.strictEqual(ctrl.state,ctrl.states.input);
		view.validateAndfire(view.eventPropertyChanged, false, new mvc.ElementValue(mvc.CurrentViewState.name, 'isDirty', null, true));
		assert.strictEqual(ctrl.state,ctrl.states.input);

		// Keep changes
		view.confirmAnswer = false;
		view.validateAndfire("cancel", false, new mvc.ElementValue(TestProxy.name, 'cancel', 0, null));
		assert.strictEqual(ctrl.state,ctrl.states.input);
		assert.strictEqual(view.location,url+'/detail/TestProxy/1');

		// Discharge changes
		view.confirmAnswer = true;
		view.validateAndfire("cancel", false, new mvc.ElementValue(TestProxy.name, 'cancel', 0, null));
		assert.strictEqual(ctrl.state,ctrl.states.start);
		assert.strictEqual(view.location,url+'/');
	});

	it('Should fail on proxy not found', function() {
		router.goto('/detail/TestProxy/10');
		assert.strictEqual(view.error.message, 'Not found');
		assert.strictEqual(ctrl.state,ctrl.states.input);
	});
});