/**
 * This class is maintained by the controllers and it's purpose is for other controllers.
 * to know what the state of the current view is.
 * It is added to the repo and thereby shared.
 */
class CurrentViewState {

	constructor() {
		this._currentView = null;
		this.reset();
	}

	/**
	 * Tells whether the current view is dirty or not. By dirty means if the user has pressed som key.
	 * @returns {boolean}
	 * 	True if dirty otherwise false
	 */
	get isDirty() {
		return this._isDirty;
	}

	/**
	 * Gets the name of the current view
	 * @returns {string|null}
	 * 	The name of the view or null when no view is active.
	 */
	get currentView() {
		return this._currentView;
	}

	/**
	 * Tells whether the view isValid or not.
	 * @deprecated
	 */
	get isValid() {
		throw Error('Not implemented any more');
	}

	/**
	 * Reset this object to dirty == false
	 */
	reset() {
		this._isDirty = false;
	}

	/**
	 * Sets the name of the property to value.
	 * @param {ElementValue} elem
	 * 	The name and value of the property to set.
	 */
	setPropertyByElement(elem) {
		switch (elem.property) {
			case 'currentView':
				if (this._currentView !== elem.value) { // Change of view results in state reset
					this._currentView = elem.value;
					this._isDirty = false;
				}
				break;
			case 'isDirty':
				this._isDirty = this._isDirty ? true : elem.value;
				break;
			default:
				throw new Error(`Unknown property ${elem.property}`);
		}
	}
}
exports.CurrentViewState = CurrentViewState;