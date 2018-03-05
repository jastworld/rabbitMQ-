// Require express and create an instance of it
var express = require('express');
var app = express();
const routes = require("./app");
const bodyParser = require("body-parser");
//Invoke routes
app.use(bodyParser.urlencoded({
    extendex : true

}));

app.use(bodyParser.json());
app.use(routes);


const port = process.env.port || 3000;
// start the server in the port 3000 !
app.listen(port, function () {
    console.log('Example app listening on port 3000.');
});