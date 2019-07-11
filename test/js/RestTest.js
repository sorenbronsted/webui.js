
const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const TestXmlHttpRequest = require('./utils/TestXmlHttpRequest.js').TestXmlHttpRequest;
const FormData = require('./utils/FormData.js').FormData;

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
		assert.notStrictEqual(sample,null);
		assert.strictEqual(JSON.stringify(sample), TestXmlHttpRequest.responseText);
	});

	it('Should get other content', async function() {
		TestXmlHttpRequest.responseText = `En anden tekst`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let sample = await rest.get('http://somehost/text');
		assert.notStrictEqual(sample, null);
		assert.strictEqual(sample, TestXmlHttpRequest.responseText);
	});

	it('Should get error content', async function() {

		TestXmlHttpRequest.responseText = `{"error":"operation failed"}`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

		try {
			let sample = await rest.get('http://somehost/error');
			assert.strictEqual.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof mvc.ApplicationException) {
				assert.strictEqual(e.error, 'operation failed');
			}
		}
	});

	it('Should get fail on status != 200', async function() {

		TestXmlHttpRequest.status = 404;

		try {
			await rest.get('http://somehost/load');
			assert.strictEqual.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof Error) {
				assert.strictEqual(parseInt(e.message), TestXmlHttpRequest.status)
			}
		}
	});

	it('Should get a network error', async function() {

		TestXmlHttpRequest.networkError = true;

		try {
			let sample = await rest.get('http://somehost/load');
			assert.strictEqual.fail('Expected an exception')
		}
		catch(e) {
			if (e instanceof Error) {
				assert.strictEqual(e.message, "Network Error")
			}
		}
	});

	it('Should execute delete request', async function() {
		TestXmlHttpRequest.responseText = `ok`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let sample = await rest.delete('http://somehost/text');
		assert.notStrictEqual(sample, null);
		assert.strictEqual(sample, TestXmlHttpRequest.responseText);
	});

	it('Should execute post request', async function() {
		TestXmlHttpRequest.responseText = `ok`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let data = new FormData();
		data.append('uid', 1);
		data.append('name', 'Kurt Humbuk');
		let sample = await rest.post('http://somehost/text', data);
		assert.notStrictEqual(sample, null);
		assert.strictEqual(sample, TestXmlHttpRequest.responseText);
		assert.strictEqual(TestXmlHttpRequest.parameters.json, '{"uid":1,"name":"Kurt Humbuk"}');
	});

	it('Should execute post request for type file', async function() {
		TestXmlHttpRequest.responseText = `ok`;
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','text');

		let file = new FormData();
		file.append('name', 'test');
		file.append('type', 'application/text');
		file.append('blob', 'test');
		let sample = await rest.post('http://somehost/text', file);
		assert.notStrictEqual(sample, null);
		assert.strictEqual(sample, TestXmlHttpRequest.responseText);
		assert.strictEqual(TestXmlHttpRequest.parameters, file);
	});
});