const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    link: { type: String, required: false },

}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('news', schema);