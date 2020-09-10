.PHONY:	test coverage bundle install

SHELL=/bin/bash

all:	install coverage testui

test:
	npm test

testui: bundle
	bin/testui.sh

testapp:
	bin/composer.phar run test

coverage:
	npm run coverage

bundle:
	npm run bundle

install:
	npm ci
