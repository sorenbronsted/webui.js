<?php

class AddBirthdate extends Ruckusing_Migration_Base {
	public function up() {
		$this->add_column('person', 'birthdate', 'date');
	}//up()

	public function down() {
		$this->remove_column('person', 'birthdate');
	}//down()
}
