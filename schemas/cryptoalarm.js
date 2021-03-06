const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    userId: { type: String, required: true, },
    currency: { type: String, required: true },
    upperBound: { type: Number, required: false },
    moneyCurrency: { type: String, required: false, default: "try" },
    lowerBound: { type: Number, required: false },
    active: { type: Boolean, required: true, default: true },
    type: { type: Number, required: true }, // 0 lower 1 upper
});

adminSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('cryptoalarms', adminSchema);