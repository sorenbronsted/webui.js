const collect          = require('collect.js');
const DataClassWrapper = require('./DataClassWrapper.js').DataClassWrapper;
const Subject          = require('../mvc/Subject.js').Subject;
const ElementValue     = require('../mvc/ElementValue.js').ElementValue;
const CurrentViewState = require('../mvc/CurrentViewState.js').CurrentViewState;
const Event 					 = require('../mvc/Event.js').Event;
const ElementFactory   = require('./ElementFactory.js').ElementFactory;
const CssDelegate      = require('./CssDelegate.js').CssDelegate;
const Formatter        = require('./Formatter.js').Formatter;
const InputValidator   = require('./InputValidator.js').InputValidator;

class View extends Subject {

	constructor(window, name, html, cssDelegate = new CssDelegate(), bindId ="content", formatter = new Formatter(),
							validator = new InputValidator(cssDelegate.input)) {
		super();
		this._isDirty = false;
		this._isValid = true;
		this.cls = this.constructor.name;
		this.eventPropertyChanged = `propertyChanged`;
		this.eventClick = `click`;
		this._formatter = formatter;
		this._validator = validator;
		this._window = window;
		this._viewName = name;
		this._cssDelegate = cssDelegate;
		this._fragment = this._createFragment(html);

		let binding = this._window.document.getElementById(bindId);
		if (binding == null) {
			throw new Error(`BindId: ${bindId} not found`);
		}
		this._binding = binding;
		this._root = new DataClassWrapper(this, this._fragment.firstChild, null, new ElementFactory());
	}

	get window() {
		return this._window;
	}

	get cssDelegate() {
		return this._cssDelegate;
	}

	get validator() {
		return this._validator;
	}

	get formatter() {
		return this._formatter;
	}

	get isDirty() {
		return this._isDirty
	}

	get isValid() {
		return this._isValid;
	}

	set isDirty(state) {
		if (this._isDirty !== state) {
			this._isDirty = state;
			super.fire(new Event(this.constructor.name, this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'isDirty', null, this._isDirty)));
		}
}

	set isValid(state) {
		if (this._isValid !== state) {
			this._isValid = state;
			super.fire(new Event(this.constructor.name, this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'isValid', null, this._isValid)));
		}
	}

	get classes() {
		return this._root.collectClasses(collect({}));
	}

	get dataLists() {
		return this._root.collectDataLists(collect({}));
	}

	get isVisible() {
		return this._binding.hasChildNodes() && this._binding.firstChild === this._root._element;
	}

	populate(sender, value) {
		if (!this.isVisible) {
			return;
		}
		this._root.populate(sender, value);
	}

	show() {
		if (this.isVisible) {
			return;
		}
		let child = this._binding.firstChild;
		if (child != null) {
			this._binding.removeChild(child);
		}
		this._binding.append(this._root._element);
		super.fire(new Event(this.constructor.name, this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'currentView', null, this._viewName)));
	}

	showErrors(msg) {
		if (msg.constructor.name === 'ApplicationException') {
			if (msg.error.constructor.name === 'String') {
				this.alert(msg.error);
			}
			else {
				let fieldsWithError = collect(msg.error.ValidationException);
				this._root.showError(fieldsWithError);
				this.isValid = false;
				this.isDirty = true;
			}
		}
		else if (msg.constructor.name === 'Error') {
			this.alert(`${msg}, server fejl`);
		}
		else {
			throw msg;
		}
	}

	validateAndfire(eventName, isValidRequired, body) {
		if (isValidRequired === true && this._isValid === false) {
			return;
		}
		super.fire(new Event(this.constructor.name, eventName, body));
	}

	confirm(question) {
		return this._window.confirm(question);
	}

	alert(message) {
		this._window.alert(message);
	}

	hideElement(id) {
		let element = this._window.document.getElementById(id);
		if (element === null) {
			throw Error(`Element not found: ${id} `);
		}
		element.classList.add('w3-hide');
	}

	showElement(id) {
		let element = this._window.document.getElementById(id);
		if (element === null) {
			throw Error(`Element not found: ${id} `);
		}
		element.classList.remove('w3-hide');
	}

	_createFragment(html) {
		let div = this._window.document.createElement('div');
		div.innerHTML = html;
		let fragment = this._window.document.createDocumentFragment();
		fragment.appendChild(div);
		return fragment;
	}
}
exports.View = View;