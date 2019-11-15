<?php

class AddPet extends Ruckusing_Migration_Base {
	public function up() {
		$this->add_column('person', 'pet', 'string', ['limit' => 32]);
	}//up()

	public function down() {
		$this->remove_column('person', 'pet');
	}//down()
}
