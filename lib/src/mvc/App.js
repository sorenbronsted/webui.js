
class App {

	async _init() {
		throw Error("Implement _init");
	}

	async run(url) {
		let router = await this._init();
		router.goto(url);
	}
}
exports.App = App;