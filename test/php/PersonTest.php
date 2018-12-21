<?php
namespace ufds;

require_once 'test/php/settings.php';

class PersonTest extends BaseCrud {

	public function __construct() {
		parent::__construct(Person::class);
	}

	protected function updateObject($object) {
		$object->name = 'Yrsa';
		$object->address = 'Svindelvej 1';
	}

	protected function createObject() {
		return Fixture::getPerson();
	}
}
