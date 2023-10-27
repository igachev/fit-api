const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({

    name : {
        type: String
    },

    exercises: [
        {

            exerciseImg: {
                type: String
            },

            exerciseName: {
                type: String
            },

            sets: [

                {
                    setNumber: {
                        type: Number
                    },
                    reps: {
                        type: Number
                    },
                    weight: {
                        type: Number
                    },
                    restTime: {
                        type: String
                    }
                }

            ]

        }
    ]

})

const Workout = mongoose.model('Workout',workoutSchema)
    
    module.exports = Workout;