<?php

class AddHeight extends Ruckusing_Migration_Base {
	public function up() {
		$this->add_column('person', 'height', 'decimal', ['scale' => 2, 'precision' => 5]);
	}//up()

	public function down() {
		$this->remove_column('person', 'pet');
	}//down()
}
