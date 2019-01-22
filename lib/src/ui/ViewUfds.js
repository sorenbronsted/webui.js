const collect = require('collect.js');
const DataClassWrapper = require('./DataClassWrapper.js').DataClassWrapper;
const Subject = require('../mvc/Subject.js').Subject;
const ElementValue = require('../mvc/ElementValue.js').ElementValue;
const CurrentViewState = require('../mvc/CurrentViewState.js').CurrentViewState;
const ElementFactory = require('./ElementFactory.js').ElementFactory;
const CssDelegateUfds = require('./CssDelegateUfds.js').CssDelegateUfds;
const Formatter = require('./Formatter.js').Formatter;
const InputValidator = require('./InputValidator.js').InputValidator;


class ViewUfds extends Subject {

	constructor(window, name, html, cssDelegate = new CssDelegateUfds(), bindId ="content", formatter = new Formatter(),
							validator = new InputValidator(cssDelegate.input)) {
		super();
		this._isDirty = false;
		this._isValid = true;
		this.cls = this.constructor.name;
		this.eventPropertyChanged = `${this.cls}/PropertyChanged`;
		this.eventClick = `${this.cls}/Click`;
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
		this._isDirty = state;
		super.fire(this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'isDirty', null, this._isDirty));
}

	set isValid(state) {
		this._isValid = state;
		super.fire(this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'isValid', null, this._isValid));
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
		super.fire(this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'currentView', null, this._viewName));
	}

	showErrors(error) {

		if (typeof error === 'object') {
			let fieldsWithError = new Map (Object.entries(error.error.ValidationException));
			if (fieldsWithError == null) {
				return;
			}
			this._root.showError(fieldsWithError);
			this.isValid = false;
			this.isDirty = true;
		}
		if (typeof error === 'collect') {

			let fieldsWithError = error['ValidationException'];
			if (fieldsWithError == null) {
				return;
			}
			this._root.showError(fieldsWithError);
			this.isValid = false;
			this.isDirty = true;
		}
		else if (typeof error === 'string') {
			this.alert(error);
		}
	}

	validateAndfire(eventName, isValidRequired, body) {
		if (isValidRequired === true && this._isValid === false) {
			return;
		}
		super.fire(eventName, body);
	}

	confirm(question) {
		return this._window.confirm(question);
	}

	alert(message) {
		this._window.alert(message);
	}

	_createFragment(html) {
		let div = this._window.document.createElement('div');
		div.innerHTML = html;
		let fragment = this._window.document.createDocumentFragment();
		fragment.appendChild(div);
		return fragment;
	}
}

exports.ViewUfds = ViewUfds;