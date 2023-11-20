const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const setId = () => new mongoose.Types.ObjectId();

const userSchema = new mongoose.Schema({

email: {
    type: String,
    required:[true,'email is required']
},

name: {
    type: String,
    
},

password: {
    type: String,
    required:[true,'password is required']
},

age: {
    type: Number,
   
},

height: {
    type: Number,
    
},

gender: {
    type: String,
    
    enum: {
        values: ["male", "female"],
        message: 'Invalid gender'
     }
},

weightUnit: {
    type: String,
    enum: {
      values: ['kg', 'lbs'],
      message: 'Invalid weight unit',
    },
    default: 'kg', // Default to kg if not specified
  },

  themeMode: {
    type: String,
    enum: {
        values: ['light','dark'],
        message: 'Invalid theme color'
    },
    default: 'light'
  },

profilePicture: {
    type: String,
    
},

upcomingWorkouts: [
    {

        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: setId, // Use the function to generate a new ObjectId
          },
   workout: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Workout'
    },
    date: {
        type: Date,
        
    }

}
]

})

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password,10)
    })
    
    userSchema.methods.validatePassword = async function(password) {
        const result = await bcrypt.compare(password, this.password);
        return result;
    }
    
    
    const User = mongoose.model('User',userSchema)
    
    module.exports = User;