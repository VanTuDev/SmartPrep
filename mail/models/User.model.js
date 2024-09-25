import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   phone: {
      type: String,
   },
   role: {
      type: Number,
      required: true,
   },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (password) {
   return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', UserSchema);
