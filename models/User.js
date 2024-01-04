const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const setId = () => new mongoose.Types.ObjectId();

const userSchema = new mongoose.Schema({

email: {
    type: String,
    required:[true,'email is required'],
    minLength: [5, 'Email must be at least 5 characters long'],
    maxLength: [60, 'Email must be less than or equal to 60 characters long']
},

name: {
    type: String,
    maxLength: [60,'User Name must be less than 60 characters long']
},

password: {
    type: String,
    required:[true,'password is required'],
    minLength: [4, 'Password must be at least 4 characters long'],
    maxLength: [10,'Password must be less than or equal to 10 characters long']
},

age: {
    type: Number,
    max: [120,'Age must be less than 120']
},

height: {
    type: Number,
    max: [300,'Height must be less than 300 cm']
},

gender: {
    type: String,
    
    enum: {
        values: ["male", "female"],
        message: 'Invalid gender'
     }
},

weight: {
  type: Number,
  max: [400, 'Weight must be less than 400 kg']
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
],

progress: [
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: setId, // Use the function to generate a new ObjectId
          },
          date: {
            type: Date
          },
          total: {
            type: Number
          },
          currentWeight: {
            type: Number
          },
         upperBody: {
            neck: {
                type: Number
              },
              shoulders: {
                type: Number
              },
              chest: {
                type: Number
              },
         },

         arms: {
            arm: {
                type: Number
              },
              forearm: {
                type: Number
              },
              wrist: {
                type: Number
              },
         },

         middleBody: {
            waist: {
                type: Number
              },
              hips: {
                type: Number
              },
         },

         legs: {
            thigh: {
                type: Number
            },
            calf: {
                type: Number
            },
            ankle: {
                type: Number
            }
         },

         foldThickness: {
            abdominal: {
                type: Number
            },
            thigh: {
                type: Number
            },
            triceps: {
                type: Number
            },
            pelvicBone: {
                type: Number
            },
            fats: {
                type: Number
            }
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