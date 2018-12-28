'use strict';

const collect = require('collect.js');
const mvc = require('../../lib/src/mvc');
const ui = require('../../lib/src/ui');
const app = require('./Person.js');

// This called from the service worker
async function main() {

	var rest = new mvc.Rest(new XMLHttpRequest());
	var store = new mvc.RestStore(rest);
	var css = new ui.CssDelegate(new ui.InputCssUfds(), new ui.AnchorCss(), new ui.TableCssUfds(window.document));
	var router = new mvc.Router(window);
	
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
