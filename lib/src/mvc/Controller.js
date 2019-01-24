const collect = require('collect.js');
const URI = require("uri-js");
const Observer = require('./Observer.js').Observer;
const Router = require('./Router.js').Router;

class Controller extends Observer {

	constructor(activationUri, repo, view) {
		super();
		this.activationUri = activationUri;
		this.repo = repo;
		this.view = view;

		this.addEventHandler('create', this.create);
		this.addEventHandler('delete', this.delete);
		this.addEventHandler('save', this.update);
		this.addEventHandler('cancel', this.cancel);
		this.addEventHandler('edit', this.edit);
		this.addEventHandler('find', this.find);
		this.addEventHandler('children', this.children);

		this.view.addEventListener(this);
		this.addEventHandler(view.eventPropertyChanged, this.changed);

		let router = this.repo.get(Router.name);
		router.addEventListener(this);
		this.addEventHandler(router.eventReadOk, this._show);

		let classes = this.view.classes;
		this.view.dataLists.each((k,v) => classes.put(k,v));

		classes.each(cls => {
			let proxy = this.repo.get(cls);
			if (proxy != null) {
				proxy.addEventListener(this);
				this.addEventHandler(proxy.eventReadOk, this.populate);
				this.addEventHandler(proxy.eventReadFail, this.fail);
				this.addEventHandler(proxy.eventCreateOk, this.populate);
				this.addEventHandler(proxy.eventCreateFail, this.fail);
				this.addEventHandler(proxy.eventUpdateOk, this.back);
				this.addEventHandler(proxy.eventUpdateFail, this.showErrors);
				this.addEventHandler(proxy.eventDeleteOk, this.reload);
				this.addEventHandler(proxy.eventDeleteFail, this.fail);
			}
		});
	}

	_show(sender, uri) {
		let parsedUri = URI.parse(uri);
		let pathSegments = parsedUri.path.split('/');
		if (pathSegments.length < 3) {
			return;
		}

		let proxy = this.repo.get(pathSegments[2]);
		if (proxy == null) {
			throw new Error(`No proxy found for cls: ${pathSegments[2]}`);
		}
		if (pathSegments.slice(0,3).join('/').toLowerCase() !== this.activationUri.toLowerCase()) {
			// Don't listen for events, when not active
			proxy.removeEventListener(this);
			return;
		}
		// Start listening on events
		proxy.addEventListener(this);

		// display view
		this.view.show();

		// read datalist which are M-1 relations to proxy
		this.view.dataLists.each(name => {
			let proxy = this.repo.get(name);
			proxy.read();
		});

		let args = collect({});
		if (parsedUri.query !== undefined) {
			parsedUri.query.split('&').forEach(elem => {
				let parts = elem.split('=');
				args.put(parts[0], parts[1]);
			});
		}
		if (pathSegments.length === 3) {
			proxy.read(args);
		}
		else {
			let lastSegment = pathSegments[pathSegments.length - 1];
			if (lastSegment === 'new') {
				proxy.create();
			}
			else {
				args.put('uid', lastSegment);
				proxy.read(args);
				// read other data-class with relation 1-M to this proxy
				this.view.classes.each(name => {
					if (name === proxy.cls) {
						return;
					}
					let related = this.repo.get(name);
					related.read(arguments);
				});
			}
		}
		this.postShow(uri);
	}

	postShow(uri) {}

	changed(sender, elem) {
		let proxy = this.repo.get(elem.cls);
		proxy.setProperty(elem);
	}

	populate(sender, value) {
		this.view.populate(sender, value);
	}

	fail(sender, message) {
		console.log(`fail sender: ${sender} - message: ${message}`);
		throw new Error(message);
	}

	back(sender, value) {
		let router = this.repo.get(Router.name);
		router.back();
	}

	reload(sender, value) {
		let router = this.repo.get(Router.name);
		router.reload();
	}

	showErrors(sender, value) {
		this.view.showErrors(value);
	}

	edit(sender, element) {
		let router = this.repo.get(Router.name);
		router.goto(element.value);
	}

	create(sender, element) {
		let router = this.repo.get(Router.name);
		router.goto(`/detail/${element.cls}/new`);
	}

	update(sender, element) {
		let proxy = this.repo.get(element.cls);
		if (proxy == null) {
			return;
		}
		proxy.update(element.uid);
	}

	delete(sender, element) {
		let proxy = this.repo.get(element.cls);
		if (proxy == null) {
			return;
		}
		if (this.view.confirm('Er du sikker på du vil slette denne?') !== true) {
			return;
		}
		proxy.delete(element.uid);
	}

	cancel(sender, elementValue) {
		let router = this.repo.get(Router.name);
		if (this.view.isDirty === undefined || this.view.isDirty)   { // Dirty view found
			if (this.view.confirm("Dine ændringer er ved at gå tabt. Vil du fortsætte?") === true) {
				router.back();
			}
		}
		else {
			router.back();
		}
	}

	find(sender, elementValue) {
		let proxy = this.repo.get(elementValue.cls);
		if (proxy == null) {
			return;
		}
		let args = collect({});
		args.put(elementValue.property, elementValue.value);
		proxy.read(args);
	}

	children(sender, elementValue) {
		let router = this.repo.get(Router.name);
		router.goto(`/list/${elementValue.cls}?${elementValue.property}=${elementValue.uid}`);
	}
}

exports.Controller = Controller;