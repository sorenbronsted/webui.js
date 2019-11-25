// This class is maintained by the controllers and it's purpose is for other controllers
// to know what the state of the current view is.
// It is added to the repo and thereby shared
class CurrentViewState {

	constructor() {
		this._currentView = null;
		this.reset();
	}

	get isDirty() {
		return this._isDirty;
	}

	get currentView() {
		return this._currentView;
	}

	get isValid() {
		throw Error('Not implemented any more');
	}

	reset() {
		this._isDirty = false;
	}

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