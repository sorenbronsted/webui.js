
const collect = require('collect.js');
const moment = require('moment');
const numeral = require('numeral');

class ValidationException {
	constructor(msg) {
		this._msg = msg;
	}

	toString() {
		return this._msg;
	}
}
exports.ValidationException = ValidationException;

class InputValidator {

	constructor(inputCss) {
		this._methods = collect({
			"date": this.date,
			"time": this.time,
			"datetime": this.datetime,
			"casenumber": this.caseNumber,
			"number": this.number,
			"email": this.email
		});
		this._css = inputCss;
	}

	set css(css) {
		this._css = css;
	}

	get css() {
		return this._css;
	}

	reset(input) {
		this._css.clear(input._element);
	}

	validate(element) {
		let isValid = true;
		let input = element._element;

		if (input.readOnly === true || input.disabled === true) {
			return isValid;
		}

		try {
			if (input.required === true) {
				input.value = this.required(input.value);
			}
			let type = element.type;
			let format = element.format;
			if (this._methods.has(type)) {
				input.value = this._methods.get(type)(input.value, format);
			}
			this._css.valid(input);
		}
		catch(e) {
			this._css.error(input, e.toString());
			isValid = false;
		}
		return isValid;
	}

	required(input) {
		if (input.trim() === '') {
			throw new ValidationException("Skal udfyldelse");
		}
		return input;
	}

	datetime(input, format) {
		let msg = "Dato og tid er ikke en gyldig, da dato og klokkeslet skal være adskilt af en blank, fx 100717 1145";
		let value = input.trim();
		if (value === '') {
			return input;
		}
		let parts = value.split(/ +/);
		if (parts.length < 1 || parts.length > 2) {
			throw new ValidationException(msg);
		}
		if (parts.length === 1) {
			if (format.match(/[YMD]/)) {
				return this.date(parts[0], format);
			}
			else {
				return this.time(parts[0], format);
			}
		}
		else {
			let formatParts = format.split(/ +/);
			return `${this.date(parts[0], formatParts[0])} ${this.time(parts[1], formatParts[1])}`;
		}
	}

	/* All ':' (delimiters) are removed
	 * What remains wil be interpret as:
	 * 9      => hour
	 * 99     => hour
	 * 9999   => hour and minute
	 * 999999 => hour, minute and seconds
	 * anything else is an error
	 */
	time(input, format) {
		let msg = "Tidspunkt er ikke en gyldig, fx 1045 eller 10:45.";
		let value = input.trim();
		if (value === '') {
			return input;
		}
		let parsed = new Date();
		value = value.replace(/[:.]/,'');
		switch (value.length) {
			case 1:
			case 2:
				parsed.setHours(parseInt(value), 0, 0);
				break;
			case 4:
				parsed.setHours(value.substring(0,2), parseInt(value.substring(2)), 0);
				break;
			case 6:
				parsed.setHours(value.substring(0,2), parseInt(value.substring(2,4)), parseInt(value.substring(4)));
				break;
			default:
				throw new ValidationException(msg);
		}
		let date = moment(parsed);
		return date.format(format);
	}

	/* All '-' (delimiters) are removed.
	 * What remains will interpret as:
	 * d      => day in current month and year
	 * dd     => day in current month and year
	 * ddm    => day and month i current year
	 * ddmm   => day and month i current year
	 * ddmmy  => if year < 40 : y + 2000 ? y + 1900
	 * ddmmyy => if year < 40 : y + 2000 ? y + 1900
	 * ddmmyyyy
	 * anything else is an error
	 */
	date(input, format) {
		let msg = "Dato er ikke en gyldig, fx ddmmyy.";
		let value = input.trim();
		if (value.length === 0) {
			return input;
		}
		let parsed = new Date();
		value = value.replace(/[.-\/]/,'');
		if (isNaN(parseInt(value))) {
			throw new ValidationException(msg);
		}
		switch(value.length) {
			case 1:
			case 2:
				parsed.setDate(parseInt(value));
				break;
			case 3:
			case 4:
				parsed.setMonth(parseInt(value.substring(2)), parseInt(value.substring(0, 2)));
				break;
			case 5:
			case 6:
			case 8:
				let yy = parseInt(value.substring(4));
				if (yy < 100) {
					if (yy < 40) {
						yy += 2000;
					}
					else {
						yy += 1900;
					}
				}
				parsed.setFullYear(yy,parseInt(value.substring(2, 4)),parseInt(value.substring(0, 2)));
				break;
			default:
				throw new ValidationException(msg);
		}
		let date = moment(parsed);
		return date.format(format);
	}

	caseNumber(input, empty) {
		let msg = "Sagsnr er ikke gyldigt, Fx 10/01 eller 20010001.";
		let value = input.trim();
		if (value === '') {
			return input;
		}
		let number = 0;
		if (value.indexOf("/") >= 0) {
			let tmp = value.split("/");
			if (tmp.length !== 2) {
				throw new ValidationException(msg);
			}
			let year = parseInt(tmp[1]);
			if (year < 100) {
				if (year < 40) {
					year += 2000;
				}
				else {
					year += 1900;
				}
			}
			number = year * 10000 + parseInt(tmp[0]);
		}
		else {
			number = parseInt(value);
		}
		if (number < 19000001 || number > 21009999) {
			throw new ValidationException(msg);
		}
		return input;
	}

	number(input, format) {
		let msg = "Tallet er ikke gyldigt, 1.234";
		let value = input.trim();
		if (value === '') {
			return input;
		}
		return numeral(input).format(format);
	}

	email(input, format) {
		let msg ="Email er ikke gyldig";
		let value = input.trim().toLowerCase();
		if (value !== '' && !value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/)) {
			throw new ValidationException(msg);
		}
		return input;
	}
}

exports.InputValidator = InputValidator;