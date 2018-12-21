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

class TextAreaTest extends PHPUnit_Framework_TestCase {
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
		self::$driver->get('http://localhost:8080/#load/textarea');

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('TextAreaTest'))
		);
	}

	public function testDefault() {
		self::$driver->findElement(WebDriverBy::cssSelector('textarea'))->click();
		self::$driver->getKeyboard()->sendKeys('aa');
		self::$driver->getKeyboard()->sendKeys(WebDriverKeys::TAB);
		$this->assertEquals('aa', self::$driver->findElement(WebDriverBy::id('load-result'))->getText());
	}

	public function testRequired() {
		self::$driver->findElement(WebDriverBy::cssSelector('textarea'))->click()->sendKeys(' ');
		self::$driver->getKeyboard()->sendKeys(WebDriverKeys::TAB);
		$element = self::$driver->findElement(WebDriverBy::cssSelector('textarea'));
		$title = $element->getAttribute('title');
		$this->assertEquals('Skal udfyldelse', $title);
	}
}
