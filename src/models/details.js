import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const Details = new Schema({
    username: String,
    first_name: String,
    last_name: String,
    city: String,
    state: String,
    country: String,
    postcode: String
});

module.exports = Mongoose.model('Details', Details);
