const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    symbol: { type: String, required: false },
    userId: { type: String, required: true, unique: false },
}, { timestamps: true });

adminSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('likedcryptos', adminSchema);