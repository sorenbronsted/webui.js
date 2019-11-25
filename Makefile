.PHONY:	test coverage bundle install

SHELL=/bin/bash

all:	install coverage

test:
	npm test

test-ui:
	bin/phpunit_8.phar test/webdriver

coverage:
	npm run coverage

bundle:
	npm run bundle

install:
	npm ci
