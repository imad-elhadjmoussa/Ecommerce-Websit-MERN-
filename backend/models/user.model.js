const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined and still indexes only present values
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        minlength: 6
        // Not required — because Google users won't have one
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cartData: {
        type: [Object], // Consider defining a CartItem schema later
        default: []
    }
}, {
    timestamps: true,
    minimize: false
});

// Only hash password if it was changed (for email/password users)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Add method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false; // No password set (likely a Google OAuth user)
    return bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = User;
