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

 sets: [
   {
     setNumber: {
       type: Number,
       required: [true, 'set number is required'],
     },
     reps: {
       type: Number,
       required: [true, 'reps are required'],
     },
     weight: {
       type: Number,
       required: [true, 'weight is required'],
     },
     restTime: {
       type: String,
       required: [true, 'rest time is required'],
     },
   },
 ]
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise