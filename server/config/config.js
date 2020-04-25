//================================================================
//  Puerto configuracion para cuando trabaje en produccion o local
//================================================================

process.env.PORT = process.env.PORT || 3000;

//================================================================
//              ENTORNO
//================================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================================================
//              Vencimiento deo token
//================================================================
//60 segundos
//60 minutos
//24 hora
//30 dias

process.env.CADUCIDA_TOKEN = 60 * 60 * 24 * 30;



//================================================================
//              Semilla de validaciom
//================================================================


process.env.SEMILLA = process.env.SEMILLA || 'el-secreto';





//================================================================
//              Base de datos
//================================================================
let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;