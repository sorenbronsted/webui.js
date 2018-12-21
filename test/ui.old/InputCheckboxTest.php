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

class InputCheckboxTest extends PHPUnit_Framework_TestCase {
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
		self::$driver->get('http://localhost:8080/#load/checkbox');

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('InputCheckboxTest'))
		);
	}

	public function testCheckbox1() {
		$input = self::$driver->findElement(WebDriverBy::id('checkbox1'));
		$result = self::$driver->findElement(WebDriverBy::id('load-result1'));


		$input->click();
		$this->assertEquals('1', $result->getText());

		$input->click();
		$this->assertEquals('0', $result->getText());
	}

	public function testCheckbox2() {
		$input = self::$driver->findElement(WebDriverBy::id('checkbox2'));
		$result = self::$driver->findElement(WebDriverBy::id('load-result2'));


		$input->click();
		$this->assertEquals('1', $result->getText());

		$input->click();
		$this->assertEquals('0', $result->getText());
	}

	public function testCheckbox3() {
		$input = self::$driver->findElement(WebDriverBy::id('checkbox3'));
		$result = self::$driver->findElement(WebDriverBy::id('load-result3'));


		$input->click();
		$this->assertEquals('1', $result->getText());

		$input->click();
		$this->assertEquals('0', $result->getText());
	}
}
