/**
 * The application where you configure the client. A typical main.js will look like this:
 * <pre>
 * const YourApp = require('./YourApp.js').YourApp;
 * let app = new YourApp(window);
 * app.run('/some/url');
 * </pre>
 */
class App {

	/**
	 * Run the app
	 * @param {string} url
	 * 	The start url
	 * @returns {Promise}
	 */
	async run(url) {
		let router = await this._init();
		router.goto('/');
		router.goto(url);
	}

	/**
	 * Here is where you setup your client.
	 * @returns {Promise}
	 * @protected
	 * @example <caption>A minimalistic required setup</caption>
	 * const mvc = require('webui.js/lib/src/mvc');
	 * const ui = require('webui.js/lib/src/ui');
	 * const app = require('./App.js');
	 *
	 * class YourApp extends mvc.App {
	 *   constructor(window) {
	 *     super();
	 *     this._window = window;
	 *   }
   *
	 *  async _init() {
	 * 	  let store  = new app.YourStore();
	 * 	  let css    = new ui.CssDelegate(new ui.InputCssW3(), new ui.AnchorCssW3(), new ui.TableCssW3(this._window.document));
	 * 	  let router = new mvc.Router(this._window);
	 *
	 * 	  // Add elements to repo
	 * 	  let repo = new mvc.Repo();
	 * 	  repo.add(router);
	 * 	  repo.add(new app.Your(store));
	 * 	  repo.add(new mvc.CurrentViewState());
	 *
	 * 	  // Load views and add controllers
	 * 	  await fetch('/html/YourList.html').then(reponse => {
	 * 		  return reponse.text().then(html => {
	 * 			  repo.add(new app.YourListCtrl(repo, new ui.View(this._window, 'YourList', html, css)));
	 * 		  });
	 * 	  });
	 *
	 * 	  await fetch(`/html/YourDetail.html`).then(reponse => {
	 * 		  return reponse.text().then(html => {
	 * 			  repo.add(new app.YourDetailCtrl(repo, new ui.View(this._window, 'YourDetail', html, css)));
	 * 		  });
	 * 	  });
	 *
	 * 	  return router;
	 * 	  }
	 * }
	 * exports.YourApp = YourApp;
	 */
	async _init() {
		throw Error("Implement _init");
	}
}
exports.App = App;