const collect = require('collect.js');
const moment = require('moment');
const numeral = require('numeral');

class Formatter {

  constructor() {
  	moment.locale('da');
		this._fn = collect({
			'date': new DateFmt(),
			'time': new TimeFmt(),
			'datetime': new DateTimeFmt(),
			'number': new NumberFmt(),
			'casenumber': new CaseNumberFmt(),
		});
  }


  display(type, value, format) {
		if (value === null || value === 'null') {
			value = "";
		}
		if (value === undefined) {
			return value;
		}
		if (type === undefined) {
			return value;
		}
		let formatter = this._fn.get(type);
		if (formatter === null) {
			return value;
		}
		return formatter.display(value, format);
  }


  internal(type, value, format) {
    if (type === undefined) {
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
	constructor() {
		this._date = new DateFmt();
		this._time = new TimeFmt();
	}

	display(input, format) {
		let valueParts = input.split(' ');
		let formatParts = format.split(' ');
		return `${this._date.display(valueParts[0], formatParts[0])} ${this._time.display(valueParts[1], formatParts[1])}`;
	}

	internal(input, format) {
		let valueParts = input.split(' ');
		let formatParts = format.split(' ');
		return `${this._date.internal(valueParts[0], formatParts[0])} ${this._time.display(valueParts[1], formatParts[1])}`;
	}
}

class TimeFmt {
  display(input, format) {
    if (input === undefined || input.trim().length === 0 || format == null) {
      return input;
    }
    let date = moment(input, 'HH:mm:ss');
    return date.format(format);
  }

  internal(input, format) {
    if (input === undefined || input.trim().length === 0 || format == null) {
      return input;
    }
		let date = moment(input, format);
    return date.format('HH:mm:ss');
  }
}

class DateFmt {
	display(input, format) {
		if (input === undefined || input.trim().length === 0 || format == null) {
			return input;
		}
		let date = moment(input);
		return date.format(format);
	}

	internal(input, format) {
		if (input === undefined || input.trim().length === 0 || format == null) {
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
  	if (isNaN(input)) {
  		return input;
		}
    var year = Math.trunc(input/10000);
    var number = input%10000;
    return `${number}/${year}`;
  }

  internal(input, format) {
    var tmp = input.split("/");
    if (tmp.length !== 2) {
      return input;
    }
    var year = Number.parseInt(tmp[1]);
    if (year < 100) {
      if (year < 40) {
        year += 2000;
      }
      else {
        year += 1900;
      }
    }
    var number = Number.parseInt(tmp[0]);
    return year*10000+number;
  }
}

exports.Formatter = Formatter;
