
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
		this.eventPropertyChanged = `propertyChanged`;
		this.eventClick = `click`;
		this.visible = false;
		this.values = collect({});
		this.error = null;
		this.window = new Window(url);
		this.message = null;
		this.confirmAnswer = null;
		this.dataLists = collect({});
		this.classes = collect({});
		this.classes.put(TestProxy.name, TestProxy.name);
	}

	get location() {
		return this.window.location;
	}

	get isDirty() {
		return false;
	}

	populate(sender, value) {
		this.values.put(sender, value);
	}

	showErrors(value) {
		this.error = value;
		//console.log(this.error);
	}

	show() {
		this.visible = true;
	}

	validateAndfire(event, validate, elementValue) {
		this.fire(new mvc.Event(this.constructor.name, event, elementValue));
	}

	alert(message) {
		this.message = message;
	}

	confirm(question) {
		this.message = question;
		return this.confirmAnswer;
	}
}
exports.TestMvcView = TestMvcView;