const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const app = require('./app.js');

class PersonApp extends mvc.App {
	constructor(httpCtor, formCtor, window) {
		super();
		this._httpCtor = httpCtor;
		this._formCtor = formCtor;
		this._window = window;
	}

	async _init() {
		let rest   = new mvc.Rest(this._httpCtor);
		let store  = new mvc.RestStore(rest, this._formCtor);
		let css    = new ui.CssDelegate(new ui.InputCssW3(), new ui.AnchorCssW3(), new ui.TableCssW3(this._window.document));
		let router = new mvc.Router(this._window);

		// Add elements to repo
		let repo = new mvc.Repo();
		repo.add(router);
		repo.add(new app.Person(store));
		repo.add(new app.Gender(store));
		repo.add(new app.Pet(store));
		repo.add(new mvc.CurrentViewState());

		// Load views and add controllers
		await rest.get('/html/PersonList.html').then(html => {
			repo.add(new app.PersonListCtrl(repo, new ui.View(this._window, 'PersonList', html, css)));
		});

		await rest.get(`/html/PersonDetail.html`).then(html => {
			repo.add(new app.PersonDetailCtrl(repo, new ui.View(this._window, 'PersonDetail', html, css)));
		});

		return router;
	}
}
exports.PersonApp = PersonApp;