const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: false },
    subscription: { type: Boolean, required: false, default: false },
    subscriptionEndDate: { type: Date, required: false, default: new Date },
    priceId: { type: String, required: false, default: null },
    promotionEmail: { type: Boolean, required: false, default: true },
    referralCode: { type: String, required: false, default: "none" }
}, { timestamps: true });


// subscription : 0 (Üyelik Yok) , 1 ("")
userSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('users', userSchema);