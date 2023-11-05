const mongoose = require('mongoose');


const exerciseSchema = new mongoose.Schema({
 exerciseName : {
    type: String,
    required: [true,'exercise name is required']
 },
 muscleGroup: {
    type: String,
    required: [true,'muscle group is required']
 },


});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise