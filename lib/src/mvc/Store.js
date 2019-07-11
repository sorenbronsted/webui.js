'use strict';

class Store {
	read(cls, args, method)	{ throw Error('Must override this method')}
	update(cls, uid)  			{ throw Error('Must override this method')}
	delete(cls, uid)  			{ throw Error('Must override this method')}
}
exports.Store = Store;