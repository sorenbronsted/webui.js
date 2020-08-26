<?php
namespace sbronsted;


class Fixture {

	public static function getPerson() {
		$o = new Person();
		$o->name = 'Kurt Humbuk';
		$o->address = 'somewhere on earth';
		$o->zipcode = 2750;
		$o->town = 'Valby';
		$o->gender = 1;
		return $o;
	}
}