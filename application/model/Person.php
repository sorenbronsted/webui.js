<?php
namespace ufds;

class Person extends ModelObject {
	private static $properties = [
		'uid'  => Property::INT,
		'name' => Property::STRING,
		'address' => Property::STRING,
		'zipcode' => Property::STRING,
		'town' => Property::STRING,
	];

	private static $mandatories = ['name', 'address', 'zipcode', 'town'];

	protected function getProperties() {
		return self::$properties;
	}

	public function getMandatories() {
		return self::$mandatories;
	}
}