//expres
require('./config/config.js');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path')



const app = express();
//body-parce
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//habiltar la carpeta public para q se vea el login in de google
app.use(express.static(path.resolve(__dirname, '../public')));
// console.log(path.resolve(__dirname, '../public'));



//Ruta General
app.use(require('./routes/index'));


//Conexion a la bd mongo

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');

});



//pueto del servidor
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', process.env.PORT);

});