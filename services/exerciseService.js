const Exercise = require('../models/Exercise.js')

exports.getAll = async () => {
    const exercises = await Exercise.find({})
    return exercises
}

exports.createExercise = async (exerciseName,muscleGroup) => {
    try {

        const exercises = await this.getAll()

        const exerciseExist = exercises.find(
            (exercise) => exercise.exerciseName === exerciseName
          );
      
          if (exerciseExist) {
            throw new Error('Exercise already exists!');
          }

        const exercise = new Exercise({
            exerciseName,
            muscleGroup,
          });
      
          const savedExercise = await exercise.save();
          return savedExercise;
    } catch (err) {
        throw err
    }
    }

    exports.deleteExercise = async (exerciseId) => {
       const exercise = await Exercise.findByIdAndDelete(exerciseId)
       return exercise
    }

    exports.filterByMuscleGroup = async (muscleGroup) => {
        try {
            let exercises = Exercise.find({})

            if(muscleGroup) {
                let regex = new RegExp(muscleGroup,'i')
                exercises = exercises.where('muscleGroup',regex) 
            }

            return exercises

        } catch (err) {
            throw err
        }
    }