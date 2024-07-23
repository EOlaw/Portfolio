const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema
const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Regex for email validation
    },
    role: { type: String, enum: ['consultant', 'client'], required: true },
    contactNumber: { type: String, unique: true }, // Changed type to String for better handling
    profilePicture: { type: String },
    lastLogin: { type: Date },
    consultantProfile: { type: Schema.Types.ObjectId, ref: 'Consultant' },
    clientProfile: { type: Schema.Types.ObjectId, ref: 'Client' },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

// Add Passport Local Mongoose plugin
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
