
const PersonApp = require('./PersonApp.js').PersonApp;

let app = new PersonApp(XMLHttpRequest, FormData, window);
app.run('/list/Person');
