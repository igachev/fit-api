const mongoose = require('mongoose');

const setId = () => new mongoose.Types.ObjectId(); // Function to generate new ObjectId

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'workout name is required'],
    maxLength: [99,'Workout Name must be less than 100 characters long'],
    minLength:[3,'Workout Name must be at least 3 characters long']
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
        required: [true,'exercise name is required'],
        maxLength: [60,'Exercise Name must be less than 60 characters long'],
        minLength:[2,'Exercise Name must be at least 2 characters long']
     },
     muscleGroup: {
        type: String,
        required: [true,'muscle group is required'],
        maxLength: [30,'Muscle Group must be less than 30 characters long'],
        minLength:[2,'Muscle Group must be at least 2 characters long']
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
           min: [1, 'Set must be a number between 1 and 10'],
           max: [10, 'Set must be a number between 1 and 10']
         },
         reps: {
           type: Number,
           required: [true, 'reps are required'],
           min: [1,'Reps must be a number between 1 and 50'],
           max: [50,'Reps must be a number between 1 and 50']
         },
         weight: {
           type: Number,
           required: [true, 'weight is required'],
           min: [0, 'Weight must be a number between 0 and 300'],
           max: [300, 'Weight must be a number between 0 and 300']
         },
         restTime: {
           type: String,
           required: [true, 'rest time is required'],
           minLength: [3, 'RestTime must be at least 3 characters long'],
           maxLength: [15,'RestTime must be less than 15 characters long']
         },
       },
     ]
    },
  ],
});

// Custom validator for the length of the exercises array
workoutSchema.path('exercises').validate(function (value) {
  return value.length >= 0 && value.length <= 30;
}, 'Exercises list must be between 0 and 30 exercises');

// Custom validator for the length of the sets array within each exercise
workoutSchema.path('exercises.$[].sets').validate(function (value) {
  return value.length >= 0 && value.length <= 10;
}, 'Sets list within each exercise must be between 0 and 10 sets');

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;