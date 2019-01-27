
const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const TestXmlHttpRequest = require('./utils/TestXmlHttpRequest.js').TestXmlHttpRequest;

describe('Rest', function() {

	let rest;

	beforeEach(function() {
		TestXmlHttpRequest.networkError = false;
		TestXmlHttpRequest.header = {};
		rest = new mvc.Rest(TestXmlHttpRequest);
	});

	it('Should get json content', async function() {
		TestXmlHttpRequest.responseText = `{"MyClass":{"uid":1,"name":"Kurt Humbuk"}}`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

		let sample = await rest.get('http://somehost/json');
		assert.notEqual(sample, null);
		assert.equal(JSON.stringify(sample), TestXmlHttpRequest.responseText);
	});

	it('Should get other content', async function() {
		TestXmlHttpRequest.responseText = `En anden tekst`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let sample = await rest.get('http://somehost/text');
		assert.notEqual(sample, null);
		assert.equal(sample, TestXmlHttpRequest.responseText);
	});

	it('Should get error content', async function() {

		TestXmlHttpRequest.responseText = `{"error":"operation failed"}`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

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

		TestXmlHttpRequest.status = 404;

		try {
			await rest.get('http://somehost/load');
			assert.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof Error) {
				assert.equal(e.message, TestXmlHttpRequest.status)
			}
		}
	});

	it('Should get a network error', async function() {

		TestXmlHttpRequest.networkError = true;

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
		TestXmlHttpRequest.responseText = `ok`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let sample = await rest.delete('http://somehost/text');
		assert.notEqual(sample, null);
		assert.equal(sample, TestXmlHttpRequest.responseText);
	});

	it('Should execute post request', async function() {
		TestXmlHttpRequest.responseText = `ok`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let data = collect({'uid':1,'name':'Kurt humbuk'});
		let sample = await rest.post('http://somehost/text', data);
		assert.notEqual(sample, null);
		assert.equal(sample, TestXmlHttpRequest.responseText);
		assert.equal(TestXmlHttpRequest.parameters, 'uid=1&name=Kurt%20humbuk');
		assert.equal(TestXmlHttpRequest.header['Content-type'], 'application/x-www-form-urlencoded');
	});

	it('Should execute post request for type file', async function() {
		TestXmlHttpRequest.responseText = `ok`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let file = {'name': 'test', 'type':'application/text', 'blob':'test'};
		let sample = await rest.postFiles('http://somehost/text', file);
		assert.notEqual(sample, null);
		assert.equal(sample, TestXmlHttpRequest.responseText);
		assert.equal(TestXmlHttpRequest.parameters, file);
	});

	it('Should transform object to an encoded string', function() {
		let o = {'uid':1,'name':'test'};
		assert.equal(rest.encodeMap(o), 'uid=1&name=test');
	});
});