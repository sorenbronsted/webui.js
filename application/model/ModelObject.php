<?php
namespace ufds;

abstract class ModelObject extends DbObject implements RestEnable, JsonEnable {

	public function jsonEncode(array $data) {
		return $data;
	}

	protected function getMandatoryErrors() {
    $mandatories = $this->getMandatories();
    $errors = [];
    $properties = $this->getProperties();
    foreach ($mandatories as $mandatory) {
      if (Property::isEmpty($properties[$mandatory], $this->$mandatory)) {
        $errors[$mandatory] = "Felt skal udfyldelse";
      }
    }
    if (count($errors) > 0) {
      $errors['class'] = $this->getClass();
    }
    return $errors;
  }

  protected function validateMandatories() {
    $errors = self::getMandatoryErrors();
    if (count($errors) > 0) {
      throw new ValidationException($errors);
    }
  }
 
  public abstract function getMandatories();

	public function save() {
		$this->validateMandatories();
		parent::save();
	}
}
