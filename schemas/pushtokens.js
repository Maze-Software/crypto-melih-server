const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const schema = new Schema({
    userId: { type: String, required: true },
    pushToken: { type: String, required: true },

}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('pushtokens', schema);