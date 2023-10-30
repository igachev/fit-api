const mongoose = require('mongoose');

const setId = () => new mongoose.Types.ObjectId(); // Function to generate new ObjectId

const setSchema = new mongoose.Schema({

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
);

const Set = mongoose.model('Set', setSchema);

module.exports = Set;