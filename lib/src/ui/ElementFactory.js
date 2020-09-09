const collect = require('collect.js');
const Anchor = require('./Anchor.js').Anchor;
const Button = require('./Button.js').Button;
const Input = require('./Input.js').Input;
const TextArea = require('./TextArea.js').TextArea;
const Select = require('./Select.js').Select;
const HtmlElement = require('./HtmlElement.js').HtmlElement;
const Table = require('./Table.js').Table;
const Datalist = require('./Datalist.js').Datalist;

class ElementFactory {

	constructor() {
		this.makers = collect({
			'INPUT': Input,
			'SELECT': Select,
			'TEXTAREA': TextArea,
			'BUTTON': Button,
			'A': Anchor,
			'TABLE': Table,
			'DATALIST': Datalist,
		});
	}

	make(view, element) {
		let maker = this.makers.get(element.tagName);
		if (maker == null) {
			return new HtmlElement(view, element, this);
		}
		return new maker(view, element, this);
	}
}
exports.ElementFactory = ElementFactory;

