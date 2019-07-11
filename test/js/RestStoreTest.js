const assert = require('assert');
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const TestXmlHttpRequest = require('./utils/TestXmlHttpRequest.js').TestXmlHttpRequest;
const FormData = require('./utils/FormData.js').FormData;
const FileList = require('./utils/FileList.js').FileList;
const File = require('./utils/File.js').File;

describe('RestStore', function() {

	let store;
	let sample = {uid:1,name:'test'};

	beforeEach(function () {
		TestXmlHttpRequest.responseText = '';
		TestXmlHttpRequest.status = 200;
		TestXmlHttpRequest.setResponseHeader('content-type','json');
		store = new mvc.RestStore(new mvc.Rest(TestXmlHttpRequest), FormData);
	});

	it('The simple case', async function () {
		await store.read('Sample');
		assert.strictEqual(TestXmlHttpRequest.method, 'GET');
		assert.strictEqual(TestXmlHttpRequest.url, '/rest/Sample');
	});

	it('Simple object case', async function () {
		await store.read('Sample', collect({f1:'x',f2:'y'}), 'm1');
		assert.strictEqual(TestXmlHttpRequest.method, 'GET');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/m1?f1=x&f2=y');
	});

	it('Complex case with multiple arguments and types', async function () {
		await store.read('Sample', collect({uid:1, data:{f1:'x',f2:'y'}}), 'm1');
		assert.strictEqual(TestXmlHttpRequest.method, 'GET');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/1/m1?data={"f1":"x","f2":"y"}');
	});

	it('With null and undefined value', async function () {
		await store.read('Sample', collect({f1:null,f2:undefined}), 'm1');
		assert.strictEqual(TestXmlHttpRequest.method, 'GET');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/m1?f1=null&f2=null');
	});

	it('Simple delete case', async function() {
		await store.delete('Sample',1);
		assert.strictEqual(TestXmlHttpRequest.method, 'DELETE');
		assert.strictEqual(TestXmlHttpRequest.url, '/rest/Sample/1');
	});

	it('Simple delete with illegal arguments', async function() {
		try {
			await store.delete('Sample');
			assert.fail('Expected an exception');
		}
		catch(e) {
			if (e.constructor.name === 'Error') {
				assert.strictEqual(true, e.message.startsWith('Must'));
			}
			else {
				throw e;
			}
		}
	});

	it('Should update a simple object', async function() {
		await store.update('Sample', {uid:1, name:'test'}, 'm1');
		assert.strictEqual(TestXmlHttpRequest.method, 'POST');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/1/m1');
		assert.strictEqual(TestXmlHttpRequest.parameters.json, '{"uid":1,"name":"test"}');
	});

	it('Should update a complex object', async function() {
		await store.update('Sample', collect({name:'test', json: collect([1,2,3]), object: {p1:'p1', p2:'p2'}}), 'm1');
		assert.strictEqual(TestXmlHttpRequest.method, 'POST');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/m1');
		assert.strictEqual(TestXmlHttpRequest.parameters.json, '{"name":"test","json":"[1,2,3]","object":"{\\"p1\\":\\"p1\\",\\"p2\\":\\"p2\\"}"}');
	});

	it('Should add some files to object', async function() {
		let fileList = new FileList();
		fileList.push(new File('a'));
		await store.update('Sample', {name:'test', file: fileList}, 'addFile');
		assert.strictEqual(TestXmlHttpRequest.method, 'POST');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/addFile');
		assert.strictEqual(TestXmlHttpRequest.parameters.json, '{"name":"test","file[]":{"name":"a"}}');

		await store.update('Sample', {name:'test', file: fileList[0]}, 'addFile');
		assert.strictEqual(TestXmlHttpRequest.method, 'POST');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/addFile');
		assert.strictEqual(TestXmlHttpRequest.parameters.json, '{"name":"test","file":{"name":"a"}}');

		await store.update('Sample', fileList, 'addFile');
		assert.strictEqual(TestXmlHttpRequest.method, 'POST');
		assert.strictEqual(decodeURI(TestXmlHttpRequest.url), '/rest/Sample/addFile');
		assert.strictEqual(TestXmlHttpRequest.parameters.json, '{"files[]":{"name":"a"}}');
	});
});