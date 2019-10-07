<?php
namespace ufds;

class Person extends ModelObject {
	private static $properties = [
		'uid'  => Property::INT,
		'name' => Property::STRING,
		'address' => Property::STRING,
		'zipcode' => Property::STRING,
		'town' => Property::STRING,
		'gender' => Property::INT,
		'birthdate' => Property::DATE,
	];

	private static $mandatories = ['name', 'address', 'zipcode', 'town'];

	public function save() {
		if (is_null($this->gender)) {
			$this->gender = 2;
		}
		parent::save();
	}

	protected function getProperties() {
		return self::$properties;
	}

	public function getMandatories() {
		return self::$mandatories;
	}
}