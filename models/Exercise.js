const mongoose = require('mongoose');

const setId = () => new mongoose.Types.ObjectId(); // Function to generate new ObjectId

const ExerciseSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: setId, // Use the function to generate a new ObjectId
      },
    exerciseImg: {
        type: String,
        required: [true, 'exercise image is required'],
      },
    exerciseName: {
        type: String,
        required: [true, 'exercise name is required'],
      },

      sets: [
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'Set',
        }
      ],
    
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;