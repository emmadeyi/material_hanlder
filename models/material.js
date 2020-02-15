const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema

const materialSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: String,
    quantity: { type: Number, default: 1 },
    unit: { type: String, required: true },
    constrain: { status: { type: Boolean, default: false }, constrain: String },
    remark: String,
    date: {
        date_created: { type: Date, default: Date.now },
        date_received: { type: Date },
        date_updated: { type: Date, default: Date.now }
    }
})

module.exports = mongoose.model('Material', materialSchema);