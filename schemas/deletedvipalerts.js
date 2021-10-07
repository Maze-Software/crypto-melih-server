const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    userId: { type: String, required: true, },
    alertId: { type: String, required: true },
});

adminSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('deletedvipalerts', adminSchema);