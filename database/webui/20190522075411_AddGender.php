<?php

class AddGender extends Ruckusing_Migration_Base {
	public function up() {
		$this->add_column('person', 'gender', 'integer');
	}//up()

	public function down() {
		$this->remove_column('person', 'gender');
	}//down()
}
