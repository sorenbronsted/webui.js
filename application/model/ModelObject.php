<?php
namespace sbronsted;

abstract class ModelObject extends DbObject implements RestEnable, JsonEnable {

	public function jsonEncode(array $data) : array {
		return $data;
	}

	protected function getMandatoryErrors(): ValidationException {
		$mandatories = $this->getMandatories();
		$errors = new ValidationException($this->getClass());
		$properties = $this->getProperties();
		foreach($mandatories as $mandatory) {
			if(Property::isEmpty($properties[$mandatory], $this->$mandatory)) {
				$errors->addError($mandatory, "Felt skal udfyldes");
			}
		}
		return $errors;
	}

	protected function validateMandatories() {
		$errors = self::getMandatoryErrors();
		if($errors->hasValidations()) {
			throw $errors;
		}
	}

	public function getMandatories(): array {
		return [];
	}
 
	public function save() : void {
		$this->validateMandatories();
		parent::save();
	}
}
