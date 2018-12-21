
const collect = new require('collect.js');
const mvc = require('../../../lib/src/mvc');
const TestHistory = require('./TestHistory').TestHistory;
const TestProxy = require('./TestProxy').TestProxy;

class Window {

	constructor(url) {
		this.history = new TestHistory(url);
	}

	get location() {
		return this.history.location;
	}

	set onpopstate(fn) {
		this.history.onpopstate = fn;
	}
}

class TestMvcView extends mvc.Subject {

	constructor(url = 'https://example.org/') {
		super();
		this.cls = this.constructor.name;
		this.eventPropertyChanged = `${this.cls}/PropertyChanged`;
		this.eventClick = `${this.cls}/Click`;
		this.visible = false;
		this.value = null;
		this.error = null;
		this.window = new Window(url);
	}

	get location() {
		return this.window.location;
	}

	get classes() {
		return collect([TestProxy.name]);
	}

	get dataLists() {
		return collect([]);
	}

	get isDirty() {
		return false;
	}

	populate(sender, value) {
		this.value = value;
	}

	showErrors(value) {
		this.error = value;
		console.log(this.error);
	}

	show() {
		this.visible = true;
	}

	validateAndfire(event, validate, elementValue) {
		this.fire(event, elementValue);
	}

	confirm(question) {
		return true;
	}
}

exports.TestMvcView = TestMvcView;