const jwt = require('jsonwebtoken');


//============================
//    VERIFICAR TOKEN
//============================

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    massage: 'Error en el token'
                }
            });

        }
        req.usuario = decoded.usuario;
        next();
    });
};

//============================
//    VERIFICAR ADMIN_ROLE
//============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.roll === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

//============================
//    VERIFICAR TOKEN de Imagenes por la URL
//============================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    massage: 'Error en el token'
                }
            });

        }

        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg

};