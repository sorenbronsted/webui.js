<?php
namespace sbronsted;

class Person extends ModelObject {
	private static $properties = [
		'uid'  => Property::INT,
		'name' => Property::STRING,
		'address' => Property::STRING,
		'zipcode' => Property::STRING,
		'town' => Property::STRING,
		'gender' => Property::INT,
		'birthdate' => Property::DATE,
		'pet' => Property::STRING,
		'height' => Property::DECIMAL,
	];

	private static $mandatories = ['name', 'address', 'zipcode', 'town'];

	public function save() : void {
		if (is_null($this->gender)) {
			$this->gender = 2;
		}
		parent::save();
	}

	protected function getProperties() : array {
		return self::$properties;
	}

	public function getMandatories() : array {
		return self::$mandatories;
	}
}