const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const schema = new Schema({
    twitterId: { type: String, required: false },
    username: { type: String, required: true },
    image: { type: String, required: false },
    info: { type: Object, required: false },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('twitterusers', schema);