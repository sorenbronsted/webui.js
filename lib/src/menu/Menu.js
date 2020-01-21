/**
 * @file
 * @todo example html markup wuth corresponding menu data
 */
const collect = require('collect.js');

/**
 * Menu is the data for html anchors of data-type menu. This is organized as at tree.
 * A menu has an uniq id, an url and a optional parameter name. When the parameter name is 'uid' the value of the uid is
 * appended to the url path. Otherwise it is appended as parameter to the url.
 * The menu maintains it state whether it is visible or not and selected or not.
 */
class Menu {
	/**
	 * @param {int} uid
	 * 	A uniq id
	 * @param {string} url
	 * 	A url for this menu
	 * @param {string} parameterName
	 * 	The name of parameter.
	 */
	constructor(uid, url, parameterName) {
		this.uid = uid;
		this._visible = false; // Is visible if any of the nodes in a subtree is selected
		this._selected = false; // Selected marks the path of selected nodes to the leaf

		this._url = url;
		this._children = collect([]);
		this._parameterName = parameterName;
		this._parameterValue = null;
	}

	/**
	 * Tells whether this menu is visible or not.
	 * @returns {boolean}
	 */
	get visible() {
		return this._visible;
	}

	/**
	 * Tells whether this menu is selected or not.
	 * @returns {boolean}
	 */
	get selected() {
		return this._selected;
	}

	/**
	 * Gets the calculated url for this menu.
	 * @returns {string}
	 * 	The calculated url
	 */
	get url() {
		if (this._parameterName !== undefined) {
			if (this._parameterValue != null) {
				if (this._parameterName === 'uid') {
					return this._url.concat('/', this._parameterValue);
				}
				return this._url.concat('?', this._parameterName, '=', this._parameterValue);
			}
			else {
				return '';
			}
		}
		return this._url;
	}

	/**
	 * Find a menu with by uid
	 * @param {int} uid
	 * 	The search uid
	 * @returns {Menu|null}
	 * 	If found it returns the menu otherwise null
	 */
	getByUid(uid) {
		if (typeof uid === 'string') {
			uid = parseInt(uid);
		}
		if (this.uid === uid) {
			return this;
		}
		let result = null;
		this._children.each(item => {
			result = item.getByUid(uid);
			if (result != null) {
				return false; // stop iterating
			}
		});
		return result;
	}

	/**
	 * Set the value of the parameter name for this menu and its children.
	 * @param {collect} args
	 * 	A set of parameter values.
	 */
	setParameter(args) {
		if (args.has(this._parameterName)) {
			if (this._parameterName === 'uid') {
				let url = '/detail/'+args.get('proxy');
				if (this._url === url) {
					this._parameterValue = args.get(this._parameterName);
				}
			}
			else {
				this._parameterValue = args.get(this._parameterName);
			}
		}
		this._children.each(child => {
			child.setParameter(args);
		});
	}

	/**
	 * Add a child menu to this menu
	 * @param {Menu} data
	 * 	The child menu to be added
	 * @returns {Menu}
	 * 	The given child menu
	 */
	push(data) {
		this._children.push(data);
		return data;
	}

	/**
	 * Find a menu in this menu or its children which matches a given url
	 * @param {string} url
	 * 	The given url
	 */
	select(url) {
		// Find the node which is selected
		if (this.url === url) {
			this._selected = true;
			// If this node has children then select the first node also
			if (this._children.isNotEmpty()) {
				this._children.first()._selected = true;
			}
		}
		else {
			this._children.each(child => child.select(url));
			if (this.uid > 0) {
				this._selected = this._children.first(elem => elem.selected) != null;
			}
		}
	}

	/**
	 * Find a menu in this menu or its children which matches a given url
	 * @param {string} url
	 * @returns {boolean}
	 * 	True when found otherwise false
	 */
	hasMatch(url) {
		let found = false;
		if (this.url === url) {
			found = true;
		}
		else {
			this._children.each(child => {
				if (child.hasMatch(url)) {
					found = true;
					return false;
				}
			});
		}
		return found;
	}

	/**
	 * Ensure that the menu and it's intermediate children are visible.
	 */
	ensureVisible() {
		// Children off root ar allways visible
		if (this.uid === 0) {
			this._children.each(child => child._visible = true);
		}
		else {
			// found is not the root node, but this node or any child node that is selected
			let found = (this._selected || this._children.filter(elem => elem._selected).count() > 0);

			// if found make children visible or look in the rest of the tree
			if (found) {
				this._visible = true;
				this._children.each(child => child._visible = true);
			}
		}
		this._children.each(child => child.ensureVisible());
	}

	/**
	 * Resets this menu and all it's to a known state which not visible and not selected
	 */
	reset() {
		this._visible = false;
		this._selected = false;
		this._children.each(child => child.reset());
	}
}
exports.Menu = Menu;
