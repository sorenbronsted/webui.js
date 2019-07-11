<?php

class AddPerson extends Ruckusing_Migration_Base {
	private $table = "person";

	public function up() {
		$t = $this->create_table($this->table, array("id" => false, 'options' => ''));
		$t->column("uid", "primary_key", array("primary_key" => true, "auto_increment" => true, "unsigned" => true, "null" => false));
		$t->column("name","string",array("limit" => 256, "null" => true));
		$t->column("address","string",array("limit" => 256, "null" => true));
		$t->column("zipcode","string",array("limit" => 8, "null" => true));
		$t->column("town","string",array("limit" => 128, "null" => true));
		$t->finish();
	}

	public function down() {
		$this->drop_table($this->table);
	}
}
