<?php
namespace ufds;

require('test/settings.php');

use Facebook\WebDriver\Chrome\ChromeDriver;
use Facebook\WebDriver\Chrome\ChromeDriverService;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;
use PHPUnit_Framework_TestCase;

class DefaultTest extends PHPUnit_Framework_TestCase {
	private static $driver;

	public static function setUpBeforeClass() {
		error_reporting(E_ALL & ~E_NOTICE);
		putenv(ChromeDriverService::CHROME_DRIVER_EXE_PROPERTY."=/home/sb/tools/dartium/chromedriver");

		$options = new ChromeOptions();
		$options->setBinary('/home/sb/tools/dartium/chrome');
		$options->addArguments([
			'--window-size=571,428',
		]);
		$capabilities = DesiredCapabilities::chrome();
		$capabilities->setCapability(ChromeOptions::CAPABILITY, $options);

		self::$driver = ChromeDriver::start($capabilities, ChromeDriverService::createDefaultService());
	}

	public static function tearDownAfterClass() {
		self::$driver->quit();
	}

	protected function setUp() {
		self::$driver->get('http://localhost:8080');
		Db::exec(Person::$db, 'delete from person');
	}

	public function testNew() {
		$this->assertEquals('WebUi Sample', self::$driver->getTitle());

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonList'))
		);

		// assert that table is empty
		$elements = self::$driver->findElements(WebDriverBy::cssSelector('table tr'));
		$this->assertEquals(1, count($elements));

		// Click on New
		self::$driver->findElement(WebDriverBy::cssSelector('button[name=create]'))->click();

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonDetail'))
		);

		// Find input and a text
		self::$driver->findElement(WebDriverBy::cssSelector('input[data-property="name"]'))->click();
		self::$driver->getKeyboard()->sendKeys('Kurt Humbuk');

		self::$driver->findElement(WebDriverBy::cssSelector('input[data-property="address"]'))->click();
		self::$driver->getKeyboard()->sendKeys('Svindelvej 1');

		self::$driver->findElement(WebDriverBy::cssSelector('input[data-property="zipcode"]'))->click();
		self::$driver->getKeyboard()->sendKeys('2500');

		self::$driver->findElement(WebDriverBy::cssSelector('input[data-property="town"]'))->click();
		self::$driver->getKeyboard()->sendKeys('Valby');

		self::$driver->findElement(WebDriverBy::cssSelector('button[name=save]'))->click();

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonList'))
		);
		$elements = self::$driver->findElements(WebDriverBy::cssSelector('table tr'));
		$this->assertEquals(2, count($elements));
	}

	public function testChangeSave() {
		Db::exec(Person::$db, 'insert into person(uid,name) values(1, "sletmig")');

		$this->assertEquals('WebUi Sample', self::$driver->getTitle());
		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonList'))
		);

		// assert that table is empty
		$elements = self::$driver->findElements(WebDriverBy::cssSelector('table tr'));
		$this->assertEquals(2, count($elements));

		// Click on name
		self::$driver->findElement(WebDriverBy::cssSelector('a[href="/#detail/Person/1"]'))->click();

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonDetail'))
		);

		// Find input and a text
		self::$driver->findElement(WebDriverBy::cssSelector('input[data-property="name"]'))->click()->clear();
		self::$driver->getKeyboard()->sendKeys('Yrsa Humbuk');

		self::$driver->findElement(WebDriverBy::cssSelector('button[name=save]'))->click();

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonList'))
		);
		$elements = self::$driver->findElements(WebDriverBy::cssSelector('table tr'));
		$this->assertEquals(2, count($elements));
	}

	public function testDelete() {
		Db::exec(Person::$db, 'insert into person(uid,name) values(1, "sletmig")');

		$this->assertEquals('WebUi Sample', self::$driver->getTitle());

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('PersonList'))
		);

		// Find delete link
		self::$driver->findElement(WebDriverBy::cssSelector('a[href="/#Person/1"]'))->click();
		$alert = self::$driver->wait()->until(WebDriverExpectedCondition::alertIsPresent());
		$alert->accept();

		// Wait for rest call to complete
		self::$driver->wait()->until(
			function ($driver) {
				return $driver->findElement(WebDriverBy::tagName('body'))->getCSSValue('cursor') == 'auto';
			}
		);

		// Now we back to square one
		$elements = self::$driver->findElements(WebDriverBy::cssSelector('table tr'));
		$this->assertEquals(1, count($elements));
	}
}
