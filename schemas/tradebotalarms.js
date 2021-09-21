const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const tradeBotSchema = new Schema({
    message: { type: String, required: true, },
    value: { type: String, required: true },
    coin: { type: String, required: true },
}, { timestamps: true });

tradeBotSchema.set('toJSON', { virtuals: true, });


module.exports = mongoose.model('tradebotalarms', tradeBotSchema);