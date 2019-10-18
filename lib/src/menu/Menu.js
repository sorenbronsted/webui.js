
const collect = require('collect.js');

/**
 * Menu is the data for anchors of type menu. This is organized as at tree, where the root node
 * is not part of the menu structure.
 */
class Menu {
	constructor(uid, uri, parameterName) {
		this.uid = uid;
		this._visible = false; // Is visible if any of the nodes in a subtree is selected
		this._selected = false; // Selected marks the path of selected nodes to the leaf

		this._uri = uri;
		this._children = collect([]);
		this._parameterName = parameterName;
		this._parameterValue = null;
	}

	get visible() {
		return this._visible;
	}

	get selected() {
		return this._selected;
	}

	get uri() {
		if (this._parameterName !== undefined) {
			if (this._parameterValue != null) {
				if (this._parameterName === 'uid') {
					return this._uri.concat('/', this._parameterValue);
				}
				return this._uri.concat('?', this._parameterName, '=', this._parameterValue);
			}
			else {
				return '';
			}
		}
		return this._uri;
	}

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

	setParameter(args) {
		if (args.has(this._parameterName)) {
			if (this._parameterName === 'uid') {
				let uri = '/detail/'+args.get('proxy');
				if (this._uri === uri) {
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

	push(data) {
		this._children.push(data);
		return data;
	}

	select(uri) {
		// Find the node which is selected
		if (this.uri === uri) {
			this._selected = true;
			// If this node has children then select the first node also
			if (this._children.isNotEmpty()) {
				this._children.first()._selected = true;
			}
		}
		else {
			this._children.each(child => child.select(uri));
			if (this.uid > 0) {
				this._selected = this._children.first(elem => elem.selected) != null;
			}
		}
	}

	hasMatch(uri) {
		let found = false;
		if (this.uri === uri) {
			found = true;
		}
		else {
			this._children.each(child => {
				if (child.hasMatch(uri)) {
					found = true;
					return false;
				}
			});
		}
		return found;
	}

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

	reset() {
		this._visible = false;
		this._selected = false;
		this._children.each(child => child.reset());
	}
}
exports.Menu = Menu;
