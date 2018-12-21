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

class InputRadioTest extends PHPUnit_Framework_TestCase {
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
		self::$driver->get('http://localhost:8080/#load/radio');

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('InputRadioTest'))
		);
	}

	public function testRadio1() {
		self::$driver->findElement(WebDriverBy::id('radio1'))->click();
		$this->assertEquals('1', self::$driver->findElement(WebDriverBy::id('load-result'))->getText());
	}

	public function testRadio2() {
		self::$driver->findElement(WebDriverBy::id('radio2'))->click();
		$this->assertEquals('2', self::$driver->findElement(WebDriverBy::id('load-result'))->getText());
	}

	public function testRadio3() {
		self::$driver->findElement(WebDriverBy::id('radio3'))->click();
		$this->assertEquals('3', self::$driver->findElement(WebDriverBy::id('load-result'))->getText());
	}
}
