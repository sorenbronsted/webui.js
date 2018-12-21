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

class InputCheckboxSelectionTest extends PHPUnit_Framework_TestCase {
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
		self::$driver->get('http://localhost:8080/#load/selection');

		// Change view
		self::$driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::id('InputCheckboxSelectionTest'))
		);
	}

	public function testSelectAll() {
		$inputs = [];
		foreach (['checkbox1','checkbox2','checkbox3'] as $id) {
			$inputs[$id] = self::$driver->findElement(WebDriverBy::id($id));
		}

		foreach ($inputs as $input) {
			$input->click();
		}
		$result = self::$driver->findElement(WebDriverBy::id('load-result'));
		$this->assertEquals('[1, 2, 3]', $result->getText());

		foreach ($inputs as $input) {
			$input->click();
		}
		$this->assertEquals('[]', $result->getText());
	}

	public function testSelectSome() {
		$inputs = [];
		foreach (['checkbox1','checkbox3'] as $id) {
			$inputs[$id] = self::$driver->findElement(WebDriverBy::id($id));
		}

		foreach ($inputs as $input) {
			$input->click();
		}
		$result = self::$driver->findElement(WebDriverBy::id('load-result'));
		$this->assertEquals('[1, 3]', $result->getText());

		foreach ($inputs as $input) {
			$input->click();
		}
		$this->assertEquals('[]', $result->getText());
	}
}
