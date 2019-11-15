
const PersonApp = require('./PersonApp.js').PersonApp;

window.onerror = () => {
	window.alert(error);
};
let app = new PersonApp(XMLHttpRequest, FormData, window);
app.run('/list/Person');
