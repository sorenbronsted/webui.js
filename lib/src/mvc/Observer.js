'use strict';

const collect = require('collect.js');

class Observer {
	handleEvent(event) {
		throw Error('You must override handleEvent')
	}
}
exports.Observer = Observer;