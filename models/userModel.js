const mongoose = require('mongoose')

//User model definition
const userSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model( 'User', userSchema )