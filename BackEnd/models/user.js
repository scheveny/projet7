const mongoose = require('mongoose');
//package qui permet de vérifier que l'adresse mail soit unique 
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true , unique: true},
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);