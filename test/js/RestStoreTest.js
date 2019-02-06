const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const TestXmlHttpRequest = require('./utils/TestXmlHttpRequest.js').TestXmlHttpRequest;

describe('Rest', function() {

	let store;
	let sample = {uid:1,name:'test'};

	beforeEach(function () {
		store = new mvc.RestStore(new mvc.Rest(TestXmlHttpRequest));
	});

	it('The simple case', async function () {
		TestXmlHttpRequest.responseText = '';
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

		await store.read('Sample');
		assert.equal(TestXmlHttpRequest.method, 'GET');
		assert.equal(TestXmlHttpRequest.url, '/rest/Sample');
	});

	it('Complex case with multiple arguments and types', async function () {
		TestXmlHttpRequest.responseText = '';
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

		await store.read('Sample', collect({uid:1, data:{f1:'x',f2:'y'}}), 'm1');
		assert.equal(TestXmlHttpRequest.method, 'GET');
		assert.equal(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/1/m1?data={"f1":"x","f2":"y"}');
	});

	it('Simple object case', async function () {
		TestXmlHttpRequest.responseText = '';
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

		await store.read('Sample', collect({f1:'x',f2:'y'}), 'm1');
		assert.equal(TestXmlHttpRequest.method, 'GET');
		assert.equal(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/m1?f1=x&f2=y');
	});

	it('With null and undefined value', async function () {
		TestXmlHttpRequest.responseText = '';
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');

		await store.read('Sample', collect({f1:null,f2:undefined}), 'm1');
		assert.equal(TestXmlHttpRequest.method, 'GET');
		assert.equal(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/m1?f1=null&f2=null');
	});

});