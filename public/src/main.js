
const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const app = require('./Person.js');

async function main() {

	let rest = new mvc.Rest(new XMLHttpRequest());
	let store = new mvc.RestStore(rest);
	let css = new ui.CssDelegate(new ui.InputCssW3(), new ui.AnchorCss(), new ui.TableCssW3(window.document));
	let router = new mvc.Router(window);
	
	// Add elements to repo
	let repo = new mvc.Repo();
	repo.add(router);
	repo.add(new app.Person(store));
	repo.add(new mvc.CurrentViewState());

	// Load views and add controllers
	await rest.get(`/html/PersonList.html`).then(html => {
		repo.add(new app.PersonListCtrl(repo, new ui.View(window, 'PersonList', html, css)));
	});

	await rest.get(`/html/PersonDetail.html`).then(html => {
		repo.add(new app.PersonDetailCtrl(repo, new ui.View(window, 'PersonDetail', html, css)));
	});

	router.goto('/list/Person');
}

main();