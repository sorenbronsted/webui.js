<?php
namespace ufds;

require('test/settings.php');

use PHPUnit\Framework\TestCase;

class PersonCrudTest extends TestCase {
	private static $page;
	private static $debug = false;

	public static function setUpBeforeClass() : void {
		self::$page = new Page(!self::$debug);
	}

	public static function tearDownAfterClass() : void {
		if (!self::$debug) {
			self::$page->quit();
		}
	}

	protected function setUp() :void {
		TestHelper::clean();
	}

	public function testNew() {
		$fixtures = [
			"name" => 'Kurt Humbuk',
			"address" => 'Svindelvej 1',
			"zipcode" => '2500',
			"town" => 'Valby',
			"pet" => 'Hund',
			"height" => '1,75',
		];
		self::$page->goto('http://localhost:8080');

		// Change view
		self::$page->waitForSelector('button[name="create"]');

		// assert that table is empty
		$element = self::$page->getElement('table > tbody > tr > td');
		$this->assertEquals('Ingen data fundet', $element->getText());

		// Click on New
		self::$page->click('button[name="create"]');

		// Change view
		self::$page->waitForSelector('button[name="save"]');

		// Find input and a text
		foreach ($fixtures as $name => $value) {
			self::$page->type("input[data-property=$name]", $value);
		}
		self::$page->click('button[name="save"]');

		sleep(1);
		// Change view
		self::$page->waitForSelector('button[name="create"]');

		$element = self::$page->getElement('table > tbody > tr > td:nth-child(2) > a');
		$this->assertEquals($fixtures['name'], $element->getText());
		$this->assertStringContainsString('/detail/Person/1', $element->getAttribute('href'));
		$element->click();

		sleep(1);
		self::$page->waitForSelector('button[name="save"]');
		foreach ($fixtures as $name => $value) {
			$element = self::$page->getElement("input[data-property=$name]");
			$this->assertEquals($value, $element->getAttribute('value'));
		}
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
