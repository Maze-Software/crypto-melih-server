const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    title: { type: String, required: false },
    tradingViewId: { type: String, required: true, unique: false },
    description: { type: String, required: false },
}, { timestamps: true });

adminSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('tradingviews', adminSchema);