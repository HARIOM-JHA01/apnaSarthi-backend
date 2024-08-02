import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = mongoose.Schema({
    username: {
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
    password: {
        type: String,
        require: true
    },
})

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });

const User = mongoose.model("User", userSchema);
export default User;