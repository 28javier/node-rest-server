const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');




const app = express();


//peticiones http

app.get('/usuario', function(req, res) {

    //paginacion de usuarios
    let desde = req.query.desde || 0;
    desde = Number(desde);

    //limite de los usuarios a ver
    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email roll img estado google')
        //los primeros 5 y saltade 5 en 5 los usuarios
        .skip(desde)
        .limit(limite)
        /////////////////////////////////////////////
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            //funcion para contar los registros
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    massage: 'Listado de todos los usuarios',
                    Total_Usuario: conteo,
                    usuarios: usuarios
                });

            });

            //////////////////////////////////


        });
});


//crear usuarios
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        roll: body.roll
    });
    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        // usuarioBD.password = null;
        res.json({
            usuario: usuarioBD
        });
    });

});

// actualizar usuarios
app.patch('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'roll']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });


});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //con esta linea se elimina un registro fisicamente ojoooo
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };
        //verificacion de error cuando usuario borrado se lo ejecuta de nuevo 
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            massage: 'Usuario Borrado corectamente',
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;