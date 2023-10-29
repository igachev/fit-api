const User = require('../models/User.js')
const jwt = require('../promisifyToken/jsonwebtoken.js')
const SECRET = process.env.JWT_SECRET

exports.register = async (email,password) => {
    const user = await User.findOne({email})

    if(user) {
        throw new Error('User already exists!')
    }

    await User.create({email,password})

}

exports.login = async (email,password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Invalid email or password!')
    }

    const checkPassword = await user.validatePassword(password)

    if(!checkPassword) {
        throw new Error('Invalid email or password!')
    }

    const payload = {_id: user._id, email: user.email};
    const token = await jwt.sign(payload, SECRET)
    
    return {
        userId: user._id,
        accessToken: token
    }
}

exports.updateUserProfile = async (userId, name, age, height, gender, profilePicture) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            name: name,
            age: age,
            height: height,
            gender: gender,
            profilePicture: profilePicture,
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  exports.getUserProfile = async (userId) => {
    try {
      const user = await User.findById(userId).select('-password'); // Exclude the 'password' field
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  };
 
  
  
  
  
  
  
  


  
  
  
  
  
  