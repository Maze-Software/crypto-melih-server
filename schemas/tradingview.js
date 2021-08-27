const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    userId: { type: String, required: false },
    tradingViewName: { type: String, required: true, unique: false },
    status: { type: Number, required: true, unique: false }, // 0 - hiç girilmemşi 1- Girilmiş ama onay bekliyor, 2- Onaylanmış- 3- Onaylanmamış
}, { timestamps: true });

adminSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('tradingviews', adminSchema);