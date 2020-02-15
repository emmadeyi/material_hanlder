const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: false, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    staff_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: {
        date_created: { type: Date, default: Date.now },
        date_updated: { type: Date, default: Date.now }
    }
})

module.exports = mongoose.model('User', userSchema);