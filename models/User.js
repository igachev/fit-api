const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

email: {
    type: String,
    required:[true,'email is required']
},

name: {
    type: String,
    required:[true,'name is required']
},

password: {
    type: String,
    required:[true,'password is required']
},

age: {
    type: Number,
    required:[true,'age is required']
},

height: {
    type: Number,
    required:[true,'height is required']
},

gender: {
    type: String,
    required: true,
    enum: {
        values: ["male", "female"],
        message: 'Invalid gender'
     }
},

profilePicture: {
    type: String,
    required:[true,'profile picture is required']
},



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