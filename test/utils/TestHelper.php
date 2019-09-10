<?php

namespace ufds;


class TestHelper {
	public static function all() {
		self::clean();
	}

	public static function clean() {
		Db::exec(DbObject::$db, 'truncate person');
	}
}