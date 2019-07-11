<?php
namespace ufds;


class Fixture {

	public static function getPerson() {
		$o = new Person();
		$o->name = 'Kurt Humbuk';
		$o->address = 'somewhere on earth';
		$o->zipcode = 2750;
		$o->town = 'Valby';
		return $o;
	}
}