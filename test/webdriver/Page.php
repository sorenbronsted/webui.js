<?php
namespace ufds;

use Exception;
use Facebook\WebDriver\Chrome\ChromeDriver;
use Facebook\WebDriver\Chrome\ChromeDriverService;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\WebDriverAlert;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverElement;
use Facebook\WebDriver\WebDriverExpectedCondition;

class Page {
	private $driver;

	public function __construct($headless = true) {
		putenv(ChromeDriverService::CHROME_DRIVER_EXE_PROPERTY."=/usr/bin/chromedriver");

		$args = [
			'--window-size=1920,1040',
			//'--start-maximized',
			'--incognito',
		];
		if ($headless) {
			$args[] = '--headless';
		}
		else {
			$args[] = '--auto-open-devtools-for-tabs';
		}

		$options = new ChromeOptions();
		$options->setBinary('/usr/bin/chromium-browser');
		$options->addArguments($args);

		$capabilities = DesiredCapabilities::chrome();
		$capabilities->setCapability(ChromeOptions::CAPABILITY, $options);
		$this->driver = ChromeDriver::start($capabilities, ChromeDriverService::createDefaultService());
	}

	public function goto(string $url) {
		$this->driver->get($url);
	}

	public function quit() {
		$this->driver->quit();
	}

	public function waitForSelector(string $css) : void {
		$this->driver->wait()->until(
			WebDriverExpectedCondition::presenceOfElementLocated(WebDriverBy::cssSelector($css))
		);
	}

	public function waitForText($css, $text) {
		$this->driver->wait()->until(
			WebDriverExpectedCondition::elementTextContains(WebDriverBy::cssSelector($css), $text)
		);
	}

	public function getElement(string $css) : WebDriverElement {
		return $this->driver->findElement(WebDriverBy::cssSelector($css));
	}

	public function getElements(string $css) : array {
		return $this->driver->findElements(WebDriverBy::cssSelector($css));
	}

	public function type(string $css, string $text) {
		$this->getElement($css)->clear()->click();
		$this->driver->getKeyboard()->sendKeys($text);
	}

	public function click(string $css) {
		$this->getElement($css)->click();
	}

	public function getAlert() {
		return $this->driver->wait()->until(WebDriverExpectedCondition::alertIsPresent());
	}

	public function getUrl() : string {
		return $this->driver->getCurrentURL();
	}

	public function getActiveDialog() : ?WebDriverAlert {
		try {
			$dialog = $this->driver->switchTo()->alert();
			// This will actually talk to the browser and verify if we an dialog open
			$dialog->getText();
			return $dialog;
		}
		catch (Exception $e) {
			return null;
		}
	}
}