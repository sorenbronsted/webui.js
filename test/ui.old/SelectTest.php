<?php
namespace ufds;

require('test/settings.php');

use Facebook\WebDriver\Chrome\ChromeDriver;
use Facebook\WebDriver\Chrome\ChromeDriverService;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;
use Facebook\WebDriver\WebDriverKeys;
use PHPUnit_Framework_TestCase;

class SelectTest extends PHPUnit_Framework_TestCase {
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
		self::$driver->get('http://localhost:8080/#load/select');

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('SelectTest'))
		);
	}

	public function testDefault() {
		self::$driver->findElement(WebDriverBy::cssSelector('select'))->click();
		self::$driver->getKeyboard()->sendKeys(WebDriverKeys::ARROW_DOWN);
		self::$driver->getKeyboard()->sendKeys(WebDriverKeys::ARROW_DOWN);
		self::$driver->getKeyboard()->sendKeys(WebDriverKeys::TAB);
		$this->assertEquals('2300', self::$driver->findElement(WebDriverBy::id('load-result'))->getText());
	}
}
