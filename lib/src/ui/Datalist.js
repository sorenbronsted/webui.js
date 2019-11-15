const ElementWrapper = require('./ElementWrapper.js').ElementWrapper;

class Datalist extends ElementWrapper {
	constructor(view, element, parentClass) {
		super(view, element);
		this._property = this.getAttribute('data-display');
	}

	set list(list) {
		this._element.innerText = null;
		if (list == null || list.isEmpty()) {
			return;
		}

		let options = this._view.window.document.createDocumentFragment();
		list.each(row => {
			let option = this._view.window.document.createElement('option');
			option.value = this._view._formatter.display(this._type, row[this._property], this._format);
			options.append(option);
		});

		this._element.append(options);
	}

	populate(sender, data) {
		// If no data is considered an anomaly
		if (!data) {
			return;
		}

		if (this._class === sender) {
			this.list = data.objects;
		}
	}

	collectDataLists(result) {
		if (this._class !== null) {
			result.put(this._class, this._class);
		}
		return result;
	}
}
exports.Datalist = Datalist;
