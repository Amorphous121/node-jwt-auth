const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    this.password = await hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function (password) {
    return compare(password, this.password);
}

const User = model('user', UserSchema);

module.exports = User;