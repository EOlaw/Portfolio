const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['consultant', 'client'], required: true },
    contactNumber: { type: Number, unique: true },
    profilePicture: { type: String },
    lastLogin: { type: Date },
    consultantProfile: { type: Schema.Types.ObjectId, ref: 'Consultant' },
    clientProfile: { type: Schema.Types.ObjectId, ref: 'Client' },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
