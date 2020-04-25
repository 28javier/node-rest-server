const express = require('express');
const app = express();


//Rutas
app.use(require('./usuarios'));
app.use(require('./login'));















module.exports = app;