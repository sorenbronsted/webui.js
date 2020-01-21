/**
 * The required method needed for the CrudProxy.
 * @interface
 */
class Store {
	/**
	 * Gets some object by cls name, filtered by optional params by calling the optional method on cls.
	 * @param {string} cls
	 * 	The class name
	 * @param {collect} params
	 * 	A map values to filter the result by
	 * @param {string} method
	 * 	The name of the method to call on class. Optional
	 * @returns {Promise}
	 * 	An array of object on the form:	<code>{SomeClass:{uid:someId, ...}}</code>
	 */
	async read(cls, params, method)	{ throw Error('Must override this method')}

	/**
	 * Updates object of classs with the given data og maybe calling the method on the class.
	 * By convention if the uid == 0 then it is create otherwise it is updated.
	 * @param {string} cls
	 * 	The class name
	 * @param {Object} data
	 * 	The propertis of the class
	 * @param {string} method
	 * 	An optional method to call
	 * @returns {Promise}
	 * 	The uid of updated the object on the form: <code>{uid:someId}</code>
	 */
	async update(cls, data, method)  			{ throw Error('Must override this method')}

	/**
	 * Delete an object by uid
	 * @param {string} cls
	 * 	The class name
	 * @param {int} uid
	 * 	The id of the object
	 * @returns {Promise}
	 * 	No values
	 */
	async delete(cls, uid)  			{ throw Error('Must override this method')}
}
exports.Store = Store;
