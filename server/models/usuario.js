const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un roll valido'
};

let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El passwoed es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    roll: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});


//linea para no enviar el campo del password
UsuarioSchema.methods.toJson = function() {
    let user = this;
    let userObject = user.toObjetct();
    delete userObject.password;

    return userObject;
};
/////////////////////////////////////////////

UsuarioSchema.plugin(uniqueValidator, { massage: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', UsuarioSchema);