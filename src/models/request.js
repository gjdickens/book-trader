import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const Request = new Schema({
  offer_user: String,
  requested_user: String,
  offer_book: Object,
  requested_book: Object,
  status: String,
  timestamp: Date
});

module.exports = Mongoose.model('Request', Request);
