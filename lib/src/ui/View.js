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

/**
 * This is the view class, which hold a piece of html, which is shown on demand, by appending the html as a child node
 * under the element with bindId.
 */
class View extends Subject {

	/**
	 * @param {window} window
	 * 	The browser window object
	 * @param {string} name
	 * 	The name of the view
	 * @param {string} html
	 * 	The html fragment to display
	 * @param {CssDelegate} cssDelegate
	 * 	The css delegator
	 * @param {string} bindId
	 * 	The id of en element where this html fragment is displayed
	 * @param {Formatter} formatter
	 * 	The formatter
	 * @param {InputValidator} validator
	 * 	The input validator
	 */
	constructor(window, name, html, cssDelegate = new CssDelegate(), bindId ="content", formatter = new Formatter(),
							validator = new InputValidator(cssDelegate.input)) {
		super();
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

		this._elements = collect([]);
		let factory = new ElementFactory();
		this._fragment.firstChild.querySelectorAll('[data-property], button[name], table[data-class], datalist[data-class]').forEach(element => {
			if (element.tagName === 'TH') { //th has data-property attributes, but the table class handles this element
				return;
			}
			let elementWrapper = factory.make(this, element);
			this._elements.push(elementWrapper);
		});
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

	set isDirty(state) {
		this.fire(new Event(this.constructor.name, this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'isDirty', null, state)));
	}

	get isValid() {
		let elem = this._elements.first(input => !input.isValid);
		return elem == null;
	}

	get classes() {
		let classes = collect({});
		this._elements.each(item => item.collectClasses(classes));
		return classes;
	}

	get dataLists() {
		let datalists = collect({});
		this._elements.each(item => item.collectDataLists(datalists));
		return datalists;
	}

	get isVisible() {
		return this._binding.hasChildNodes();
	}

	populate(sender, value) {
		if (!this.isVisible) {
			return;
		}
		this._elements.each(item => item.populate(sender, value));
	}

	show() {
		if (this.isVisible) {
			return;
		}
		let child = this._binding.firstChild;
		if (child != null) {
			this._binding.removeChild(child);
		}
		this._binding.append(this._fragment.firstChild);
		super.fire(new Event(this.constructor.name, this.eventPropertyChanged, new ElementValue(CurrentViewState.name, 'currentView', null, this._viewName)));
	}

	showErrors(msg) {
		if (msg.constructor.name === 'ApplicationException') {
			if (msg.error.constructor.name === 'String') {
				this.alert(msg.error);
			}
			else {
				let fieldsWithError = collect(msg.error);
				this._elements.each(item => item.showError(fieldsWithError));
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
		if (isValidRequired === true && this.isValid === false) {
			return;
		}
		this.fire(new Event(this.constructor.name, eventName, body));
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
		this._cssDelegate.view.hide(element);
	}

	showElement(id) {
		let element = this._window.document.getElementById(id);
		if (element === null) {
			throw Error(`Element not found: ${id} `);
		}
		this._cssDelegate.view.show(element);
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