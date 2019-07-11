const collect = require('collect.js');
const DataPropertyWrapper = require('./DataPropertyWrapper.js').DataPropertyWrapper;
const ContainerWrapper = require('./ContainerWrapper.js').ContainerWrapper;
const DataTypeMenuWrapper = require('./DataTypeMenuWrapper.js').DataTypeMenuWrapper;
const Anchor = require('./Anchor.js').Anchor;
const Button = require('./Button.js').Button;
const Input = require('./Input.js').Input;
const TextArea = require('./TextArea.js').TextArea;
const Select = require('./Select.js').Select;
const Span = require('./Span.js').Span;
const Table = require('./Table.js').Table;
const Th = require('./Th.js').Th;

class ElementFactory {

	constructor() {
		this.makers = collect({
			'FORM': DataPropertyWrapper,
			'DIV': DataPropertyWrapper,
			'SECTION': DataPropertyWrapper,
			'FIELDSET': DataPropertyWrapper,
			'NAV': DataTypeMenuWrapper,
			'INPUT': Input,
			'SELECT': Select,
			'SPAN': Span,
			'TEXTAREA': TextArea,
			'BUTTON': Button,
			'A': Anchor,
			'TABLE': Table,
			'TH': Th,
		});

	}

	make(view, element, parentClass) {
		let maker = this.makers.get(element.tagName);
		if (maker == null) {
			throw new Error(`Constructor for type ${element.tagName} not found`);
		}
		return new maker(view, element, parentClass, this);
	}
}

exports.ElementFactory = ElementFactory;

