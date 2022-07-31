const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userShema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    tokens: [
      {
        token: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

userShema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id}, process.env.JWT_TOKEN);
  user.tokens = user.tokens.concat({token});
  await user.save();

  return token;
}

userShema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({username});

  if(!user) {
    throw new Error('Unable to Login..');
  }

  const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to Login");
    }


  return user
}

userShema.pre('save', async function(next) {
  const user = this;
  if(user.isModified('password') ) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

const User = mongoose.model('User', userShema);

module.exports = User;