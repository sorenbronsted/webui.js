
const assert = require('assert');
const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

let browser;
let page;

const options = {
	//headless: false,
	//slowMo: 100,
	timeout: 0,
	args: ['--start-maximized', '--window-size=1920,1040']
};

before(async () => {
	browser = await puppeteer.launch(options);
	page = await browser.newPage();
	//await page.coverage.startJSCoverage();
});

after(async () => {
	//const coverage = await page.coverage.stopJSCoverage();
	//pti.write(coverage);
	await browser.close()
});

describe('Person CRUD', async () => {

	beforeEach( async () => {
		await page.goto('http://localhost:8080');
	});

	it('Should create a new person', async function() {
		let create = await page.waitForSelector('button[name=create]');
		await create.click();

		let save = await page.waitForSelector('button[name=save]');
		await page.type('input[data-property=name]', 'test');
		await page.type('input[data-property=address]', 'test');
		await page.type('input[data-property=zipcode]', '1000');
		await page.type('input[data-property=town]', 'test');

		await save.click();
		await page.waitForSelector('button[name=create]');
		let result = await page.$eval('tbody td:nth-child(2)', e => e.innerText);
		assert.strictEqual('test', result);

		result = await page.$eval('tbody td:nth-child(4)', e => e.innerText);
		assert.strictEqual('1000', result);
	});

	it('Should edit person', async function() {
		await page.waitForSelector('button[name=create]');

		await page.click('tbody > tr > td:nth-child(2) > a');

		let save = await page.waitForSelector('button[name=save]');
		let name = 'input[data-property=name]';
		await page.$eval(name, e => e.value = '');
		await page.type(name, 'sletmig');

		await save.click();
		await page.waitForSelector('button[name=create]');
		let result = await page.$eval('tbody td:nth-child(2)', e => e.innerText);
		assert.strictEqual('sletmig', result);
	});

	it('Should delete the person', async function() {
		await page.waitForSelector('button[name=create]');

		let rowCount = await page.$eval('tbody', e => e.childElementCount);
		assert.strictEqual(1, rowCount);

		page.on('dialog', async dialog => {
			await dialog.accept();
		});

		await page.click('tbody td:nth-child(1) > a');
		await page.waitFor('tbody', () => document.querySelector('tbody').childElementCount < 1);
	});
});