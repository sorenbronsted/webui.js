'use strict';

const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const app = require('./app.js');

async function main() {

	var rest   = new mvc.Rest(XMLHttpRequest);
	var store  = new mvc.RestStore(rest, FormData);
	let css    = new ui.CssDelegate(new ui.InputCssW3(), new ui.AnchorCssW3(), new ui.TableCssW3(window.document));
	var router = new mvc.Router(window);
	
	// Add elements to repo
	let repo = new mvc.Repo();
	repo.add(router);
	repo.add(new app.Person(store));
	repo.add(new app.Gender(store));
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
