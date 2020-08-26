<?php
namespace sbronsted;

use RuntimeException;

class Gender implements RestEnable {

	/**
	 * Get an object by a given class and uid.
	 * @param $uid uniq identifier for an object
	 * @return RestEnable object
	 */
	public static function getByUid(int $uid) : object {
		throw new RuntimeException('Not implemented');
	}

	/**
	 * Get a list of objects by a given class which match all the properties in $qbe (QueryByExample)
	 * @param $qbe a map of properties to match
	 * @param $order an array properties to order by
	 * @return array of RestEnable objects
	 */
	public static function getBy(array $qbe, array $order) : iterable{
		throw new RuntimeException('Not implemented');
	}

	/**
	 * Get all objects for an given class
	 * @param $order an array properties to order by
	 * @return array of RestEnable objects
	 */
	public static function getAll(array $order) : iterable {
		$genders = [
			(object)['uid' => 1, 'name' => 'Mand', 'class' => 'Gender'],
			(object)['uid' => 2, 'name' => 'Kvinde', 'class' => 'Gender'],
		];

		return $genders;
	}

	/**
	 * Set the properties of a given class
	 * @param $data a map properties and values
	 * @return none
	 */
	public function setData(array $data) : void {
		throw new RuntimeException('Not implemented');
	}

	/**
	 * Persist the object
	 * @return map with the uid
	 */
	public function save() : void {
		throw new RuntimeException('Not implemented');
	}

	/**
	 * Delete a given object
	 * @return none
	 */
	public function destroy() : void {
		throw new RuntimeException('Not implemented');
	}
}