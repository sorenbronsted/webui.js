
const PersonApp = require('./PersonApp.js').PersonApp;

window.onerror = (error) => {
	window.alert(error);
};
let app = new PersonApp(XMLHttpRequest, FormData, window);
app.run('/list/Person');
