import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const Book = new Schema({
    title: String,
    author: String,
    image_url: String,
    username: String,
    timestamp: Date
});

module.exports = Mongoose.model('Book', Book);
