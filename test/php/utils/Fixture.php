<?php
namespace ufds;


class Fixture {

	public static function getPerson() {
		$o = new Person();
		$o->name = 'Kurt Humbuk';
		$o->address = 'somewhere on earth';
		return $o;
	}
}