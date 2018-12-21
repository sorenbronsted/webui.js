
const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const TestXmlHttpRequest = require('./utils/TestXmlHttpRequest.js').TestXmlHttpRequest;

describe('Rest', function() {

	let handler;
	let rest;

	beforeEach(function() {
		handler = new TestXmlHttpRequest();
		rest = new mvc.Rest(handler);
	});

	it('Should get json content', async function() {
		handler.responseText = `{"MyClass":{"uid":1,"name":"Kurt Humbuk"}}`;
		handler.status = 200;
		handler.setResponseHeader('content-type','json');

		let sample = await rest.get('http://somehost/json');
		assert.notEqual(sample, null);
		assert.equal(JSON.stringify(sample), handler.responseText);
	});

	it('Should get other content', async function() {

		handler.responseText = `En anden tekst`;
		handler.status = 200;
		handler.setResponseHeader('content-type','text');

		let sample = await rest.get('http://somehost/text');
		assert.notEqual(sample, null);
		assert.equal(sample, handler.responseText);
	});

	it('Should get error content', async function() {

		handler.responseText = `{"error":"operation failed"}`;
		handler.status = 200;
		handler.setResponseHeader('content-type','json');

		try {
			let sample = await rest.get('http://somehost/error');
			assert.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof mvc.ApplicationException) {
				assert.equal(e.error, 'operation failed');
			}
		}
	});

	it('Should get fail on status != 200', async function() {

		handler.status = 404;

		try {
			let sample = await rest.get('http://somehost/load');
			assert.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof Error) {
				assert.equal(e.message, handler.status)
			}
		}
	});

	it('Should get a network error', async function() {

		handler.networkError = true;

		try {
			let sample = await rest.get('http://somehost/load');
			assert.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof Error) {
				assert.equal(e.message, "Network Error")
			}
		}
	});

	it('Should execute delete request', async function() {
		handler.responseText = `ok`;
		handler.status = 200;
		handler.setResponseHeader('content-type','text');

		let sample = await rest.delete('http://somehost/text');
		assert.notEqual(sample, null);
		assert.equal(sample, handler.responseText);
	});

	it('Should execute post request', async function() {
		handler.responseText = `ok`;
		handler.status = 200;
		handler.setResponseHeader('content-type','text');

		let data = collect({'uid':1,'name':'Kurt humbuk'});
		let sample = await rest.post('http://somehost/text', data);
		assert.notEqual(sample, null);
		assert.equal(sample, handler.responseText);
		assert.equal(handler.parameters, 'uid=1&name=Kurt%20humbuk');
		assert.equal(handler.header['Content-type'], 'application/x-www-form-urlencoded');
	});

	it('Should execute post request for type file', async function() {
		handler.responseText = `ok`;
		handler.status = 200;
		handler.setResponseHeader('content-type','text');

		let file = {'name': 'test', 'type':'application/text', 'blob':'test'};
		let sample = await rest.postFile('http://somehost/text', file);
		assert.notEqual(sample, null);
		assert.equal(sample, handler.responseText);
		assert.equal(handler.parameters, file);
	});

	it('Should transform object to an encoded string', function() {
		let o = {'uid':1,'name':'test'};
		assert.equal(rest.encodeMap(o), 'uid=1&name=test');
	});
});