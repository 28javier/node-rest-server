const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path')

//defaul option
app.use(fileUpload());


app.patch('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ah seliccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos  permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'git', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones del archivo permitida son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //cambiar el nombre al archivo
    //id de la imagen . 1232 milesegundos . jpg extension del archivo
    let nombreArch = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    archivo.mv(`uploads/${tipo}/${ nombreArch }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //imagen cragada aqui 
        //si fueran mas imagenes por carpetas abria q hacer un swict
        if (tipo === 'usuarios') {
            ImagenUsuario(id, res, nombreArch);
        } else {
            ImagenProducto(id, res, nombreArch);
        }


    });
});

function ImagenUsuario(id, res, nombreArch) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borrarArchivo(nombreArch, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArch, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArch;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                message: 'Guadado correctamente',
                usuario: usuarioGuardado,
                img: nombreArch
            });
        });
    });

}

function ImagenProducto(id, res, nombreArch) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borrarArchivo(nombreArch, 'productos');
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArch, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');


        productoDB.img = nombreArch;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                message: 'Guadado correctamente',
                producto: productoGuardado,
                img: nombreArch
            });
        });
    });
}







function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;