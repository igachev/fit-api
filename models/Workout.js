const mongoose = require('mongoose');

const setId = () => new mongoose.Types.ObjectId(); // Function to generate new ObjectId

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'workout name is required'],
  },
  authorId: {
    type: mongoose.Types.ObjectId
  },
  exercises: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: setId, // Use the function to generate a new ObjectId
      },
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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: setId, // Use the function to generate a new ObjectId
        },
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
    },
  ],
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;