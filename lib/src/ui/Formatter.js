const collect = require('collect.js');
const moment = require('moment');
const numeral = require('numeral');

class Formatter {

	constructor() {
		this._fn = collect({
			'date': new DateTimeFmt(),
			'time': new DateTimeFmt(),
			'datetime': new DateTimeFmt(),
			'number': new NumberFmt(),
			'casenumber': new CaseNumberFmt(),
		});
	}

	display(type, value, format) {
		if (value === null || value === 'null') {
			value = '';
		}
		if (type === null) {
			return value;
		}
		let formatter = this._fn.get(type);
		if (formatter === null) {
			return value;
		}
		return formatter.display(value, format);
	}

	internal(type, value, format) {
		if (type === null) {
			return value;
		}
		let formatter = this._fn.get(type);
		if (formatter === null) {
			return value;
		}
		return formatter.internal(value, format);
	}
}

class DateTimeFmt {
	display(input, format) {
		if (input == null || input.trim().length === 0 || format == null) {
			return input;
		}
		let date = moment(input);
		return date.format(format);
	}

	internal(input, format) {
		if (input === null || input.trim().length === 0 || format === null) {
			return input;
		}
		let date = moment(input, format);
		return date.format('YYYY-MM-DD');
	}
}

class NumberFmt {

	display(input, format) {
		if (input === undefined || format === undefined) {
			return input;
		}
		return numeral(input).format(format);
	}

	internal(input, format) {
		if (input === undefined || input.trim().length === 0 || format === undefined) {
			return input;
		}
		return numeral(input, format).value();
	}
}

class CaseNumberFmt {
	display(input, format) {
		if (input.length !== 8) {
			return input;
		}
		let year = input.substring(0, 4);
		let number = Number.parseInt((input.substring(4)));
		return `${number}/${year}`;
	}

	internal(input, format) {
		let tmp = input.split("/");
		if (tmp.length !== 2) {
			return input;
		}
		let year = Number.parseInt(tmp[1]);
		if (year < 100) {
			if (year < 40) {
				year += 2000;
			} else {
				year += 1900;
			}
		}
		let number = Number.parseInt(tmp[0]);
		return `${year * 10000 + number}`;
	}
}

exports.Formatter = Formatter;
