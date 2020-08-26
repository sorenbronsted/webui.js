.PHONY:	test coverage bundle install

SHELL=/bin/bash

all:	install coverage

test:
	npm test

testui:
	bin/composer.phar run testui

testapp:
	bin/composer.phar run test

coverage:
	npm run coverage

bundle:
	npm run bundle

install:
	npm ci
