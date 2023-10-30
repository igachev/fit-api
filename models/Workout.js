const mongoose = require('mongoose');

const setId = () => new mongoose.Types.ObjectId(); // Function to generate new ObjectId

const workoutSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'workout name is required'],
  },

  exercises: [

    {type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    }

  ],
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;