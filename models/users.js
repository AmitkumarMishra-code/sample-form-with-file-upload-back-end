const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    address: {
        type: String
    },
    file: {
      data: Buffer,
      contentType: String
    },
    fileName: {
      type: String
    },

}, { timestamps: true });

const UsersModel = mongoose.model('Users', UsersSchema);

module.exports = UsersModel;