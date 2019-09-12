.PHONY:	test coverage bundle install

SHELL=/bin/bash

all:	install coverage

test:
	npm test

coverage:
	npm run coverage

bundle:
	npm run bundle

install:
	npm ci
