
// This class is maintained by the controllers and it's purpose is for other controllers
// to know what the state of the current view is.
// It is added to the repo and thereby shared
class CurrentViewState {

	constructor() {
		this._isDirty = false;
		this._isValid = true;
		this._currentView = null;
	}

	get isDirty() {
		return this._isDirty;
	}

	get isValid() {
		return this._isValid;
	}

	get currentView() {
		return this._currentView;
	}

	setProperty(elem) {
		switch (elem.property) {
			case 'currentView':
				if (this._currentView !== elem.value) { // Change of view results in state reset
					this._currentView = elem.value;
					this._isDirty = false;
					this._isValid = true;
				}
				break;
			case 'isDirty':
				this._isDirty = elem.value;
				break;
			case 'isValid':
				this._isValid = elem.value;
				break;
			default:
				throw new Error(`Unknown property ${elem.property}`);
		}
	}
}

exports.CurrentViewState = CurrentViewState;