const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const investing = new Schema({
    userId: { type: String, required: true, },
    coinType: { type: String, required: true },
    amount: { type: Number, required: false },
    date: { type: Date, required: false },
    price: { type: Number, required: false },
    note: { type: String, required: true, default: true },
    currency: { type: String, required: true }, // 0 lower 1 upper
}, { timestamps: true });

investing.set('toJSON', { virtuals: true });


module.exports = mongoose.model('investing', investing);