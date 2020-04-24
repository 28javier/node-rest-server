//================================================================
//  Puerto configuracion para cuando trabaje en produccion o local
//================================================================

process.env.PORT = process.env.PORT || 3000;

//================================================================
//              ENTORNO
//================================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================================================
//              Base de datos
//================================================================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb+srv://javier:javiervl28.@cluster0-dxk5i.mongodb.net/cafe';
}

process.env.URLDB = urlBD;