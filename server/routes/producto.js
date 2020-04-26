const express = require('express');
const { verificaToken } = require('../middleware/autenticacion');


let app = express();
let Producto = require('../models/producto');





app.get('/producto', verificaToken, (req, res) => {

    //paginacion de usuarios
    let desde = req.query.desde || 0;
    desde = Number(desde);

    //limite de los usuarios a ver
    let limite = req.query.limite || 0;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                message: 'Listado de los productos',
                producto: productoDB
            })
        })


});




app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el producto'
                    }
                });
            }

            res.json({
                ok: true,
                message: 'Producto encontrado:',
                producto: productoDB
            });

        })
});



app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombrePro: body.nombrePro,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear el producto por que no existe el id'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto creado correctamente',
            producto: productoDB
        });


    });
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regular = new RegExp(termino, 'i');
    Producto.find({ nombrePro: regular })
        .populate('producto', 'nombrePro PrecioUni')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                message: 'aaaaaaaaaaaa',
                producto: productoDB
            });
        });
});



app.patch('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el id no se puede actualizar'
                }
            });
        }
        productoDB.nombrePro = body.nombrePro;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                message: 'Actualizado correctamente',
                producto: productoGuardado
            });
        });
    });
});


app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe para eliminarlo'
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                message: 'Producto elminado correctamente',
                producto: productoBorrado
            });

        });


    });


});















module.exports = app;