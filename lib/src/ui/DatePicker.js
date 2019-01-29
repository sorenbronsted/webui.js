const TinyDatePicker = require('tiny-date-picker');
const moment = require('moment');

const options = {
	// What dom element the date picker will be added to. This defaults
	// to document.body
	// appendTo: window.document.body,

	// Lang can be used to customize the text that is displayed
	// in the calendar. You can use this to display a different language.
	lang: {
		days: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
		months: [
			'Januar',
			'Februar',
			'Marts',
			'April',
			'Maj',
			'Juni',
			'Juli',
			'August',
			'September',
			'Oktober',
			'November',
			'December',
		],
		today: 'I dag',
		clear: 'Ryd',
		close: 'Luk',
	},

	// format {Date} -> string is a function which takes a date and returns a string. It can be used to customize
	// the way a date will look in the input after the user has selected it, and is particularly
	// useful if you're targeting a non-US customer.
	format(date) {
		let newdate = isNaN(date) ? moment('DD-MM-YYYY') :  moment(date, 'DD-MM-YYYY');
		return newdate.format( 'DD-MM-YYYY');
	},

	// parse {string|Date} -> Date is the inverse of format. If you specify one, you probably should specify the other
	// the default parse function handles whatever the new Date constructor handles. Note that
	// parse may be passed either a string or a date.
	parse(str) {
		return moment(str, 'DD-MM-YYYY');
	},

	// mode {'dp-modal'|'dp-below'|'dp-permanent'} specifies the way the date picker should display:
	// 'dp-modal' displays the picker as a modal
	// 'dp-below' displays the date picker as a dropdown
	// 'dp-permanent' displays the date picker as a permanent (always showing) calendar
	mode: 'dp-below',

	// hilightedDate specifies what date to hilight when the date picker is displayed and the
	// associated input has no value.
	hilightedDate: new Date(),

	// min {string|Date} specifies the minimum date that can be selected (inclusive).
	// All earlier dates will be disabled.
	min: '1/1/1900', // e.g. '10/1/2016',

	// max {string|Date} specifies the maximum date that can be selected (inclusive).
	// All later dates will be disabled.
	max: '1/1/2099', // e.g. '10/1/2020',

	// inRange {Date} -> boolean takes a date and returns true or false. If false, the date
	// will be disabled in the date picker.
	inRange(dt) {
		return true; // e.g. dt.getFullYear() % 2 > 0;
	},

	// dateClass {Date} -> string takes a date and returns a CSS class name to be associated
	// with that date in the date picker.
	dateClass(dt) {
		return dt.getFullYear() % 2 ? 'odd-date' : 'even-date';
	},

	// dayOffset {number} specifies which day of the week is considered the first. By default,
	// this is 0 (Sunday). Set it to 1 for Monday, 2 for Tuesday, etc.
	dayOffset: 1,

};

class DatePicker {

	constructor (input, format) {
		options.appendTo = input;
		this.picker = new TinyDatePicker(input, options);
	}

}

exports.DatePicker = DatePicker;
