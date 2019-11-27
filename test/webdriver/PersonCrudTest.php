<?php
namespace ufds;

require('test/settings.php');

use PHPUnit\Framework\TestCase;

class PersonCrudTest extends TestCase {
	private static $page;

	public static function setUpBeforeClass() : void {
		self::$page = new Page();
	}

	public static function tearDownAfterClass() : void {
		self::$page->quit();
	}

	protected function setUp() :void {
		TestHelper::clean();
	}

	public function testNew() {
		self::$page->goto('http://localhost:8080');

		// Change view
		self::$page->waitForSelector('button[name="create"]');

		// assert that table is empty
		$element = self::$page->getElement('table > tbody > tr > td');
		$this->assertEquals('Ingen data fundet', $element->getText());

		// Click on New
		self::$page->click('button[name=create]');

		// Change view
		self::$page->waitForSelector('button[name="save"]');

		// Find input and a text
		self::$page->type('input[data-property="name"]', 'Kurt Humbuk');
		self::$page->type('input[data-property="address"]', 'Svindelvej 1');
		self::$page->type('input[data-property="zipcode"]', '2500');
		self::$page->type('input[data-property="town"]', 'Valby');
		self::$page->type('input[data-property="pet"]', 'Hund');
		self::$page->type('input[data-property="height"]', '1,75');
		self::$page->click('button[name=save]');

		// Change view
		self::$page->waitForSelector('button[name="create"]');

		$element = self::$page->getElement('table > tbody > tr > td:nth-child(2) > a');
		$this->assertEquals('Kurt Humbuk', $element->getText());
		$this->assertStringContainsString('/detail/Person/1', $element->getAttribute('href'));
	}

	public function testChangeSave() {
		$person = Fixture::getPerson();
		$person->name = 'sletmig';
		$person->save();

		self::$page->goto('http://localhost:8080');
		self::$page->waitForSelector('button[name="create"]');

		// assert that table is not empty
		$element = self::$page->getElement('table > tbody > tr > td:nth-child(2) > a');
		$this->assertEquals('sletmig', $element->getText());

		// Click on name
		$element->click();

		// Change view
		self::$page->waitForSelector('button[name="save"]');

		// Find input and a text
		self::$page->type('input[data-property="name"]', 'Yrsa Humbuk');

		self::$page->click('button[name=save]');

		// Change view
		self::$page->waitForSelector('button[name="create"]');
		$element = self::$page->getElement('table > tbody > tr > td:nth-child(2) > a');
		$this->assertEquals('Yrsa Humbuk', $element->getText());
	}

	public function testDelete() {
		$person = Fixture::getPerson();
		$person->name = 'sletmig';
		$person->save();

		self::$page->goto('http://localhost:8080');
		self::$page->waitForSelector('button[name="create"]');

		// Find delete link
		self::$page->click('table > tbody > tr > td:nth-child(1) > a');
		$alert = self::$page->getAlert();
		$alert->accept();

		// Wait for rest call to complete
		self::$page->waitForText('table > tbody > tr > td', 'Ingen data fundet');

		$this->assertTrue(true);
	}
}
