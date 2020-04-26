const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middleware/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion') //mostrar el orden
        .populate('usuario', 'nombre email') //mostarr los otros campos de las tablas mas ordenados
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                message: 'Todas las categorias',
                categoria: categoriaDB
            })

        });

});


app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            message: 'La categoria es esta:',
            categoria: categoriaDB
        });

    });

});



app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria creada correctamente'
        });


    });


});


app.patch('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se puede actualizar la categoria '
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria actualizada correctamente',
            categoria: categoriaDB,

        });
    });
});


app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe no se elimino nada'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Eliminado correctamente la categoria',
            categoria: categoriaDB
        })

    });
});





















module.exports = app;