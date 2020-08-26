
# Webdriver

This test uses w3c webdriver standard with [Facebook webdriver](https://github.com/facebook/php-webdriver) 
implementation. This will work with selenium project, but here I only use the chrome webdriver.

To make this work you much install [chromium-webdriver](https://chromedriver.chromium.org). 
On ubuntu you just `apt install chromium-chromedriver` or download it from the website. It is important that
the chromium-webdriver matches the chromium-browser version.

I have tried [puppeteer](https://pptr.dev) which has a nice api and everything is packages together in npm. 
But I think it is hard to use, because of timing issues between the test client (node process) and
the the web browser. This standard webdriver approach is much more stable.  