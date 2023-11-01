const Workout = require('../models/Workout.js')
const Exercise = require('../models/Exercise.js')

exports.createWorkout = async (name) => {
try {
    const workout = new Workout({
        name,
        exercises: [],
      });
  
      const savedWorkout = await workout.save();
      return savedWorkout;
} catch (err) {
    throw err
}
}

exports.addExerciseToWorkout = async (workoutId, exerciseDetails, setDetails) => {
  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      throw new Error('Workout not found');
    }

    // Check if an exercise with the same name already exists in the workout
    const existingExercise = workout.exercises.find(
      (exercise) => exercise.exerciseName === exerciseDetails.nameOfExercise
    );

    if (existingExercise) {
      // If the exercise already exists, add the set to it
      existingExercise.sets.push({
        setNumber: setDetails.setNumber,
        reps: setDetails.reps,
        weight: setDetails.weight,
        restTime: setDetails.restTime,
      });
    } else {
      // If the exercise doesn't exist, create a new exercise
      const newExercise = {
        exerciseName: exerciseDetails.nameOfExercise,
        muscleGroup: exerciseDetails.nameOfMuscleGroup,
        sets: [
          {
            setNumber: setDetails.setNumber,
            reps: setDetails.reps,
            weight: setDetails.weight,
            restTime: setDetails.restTime,
          },
        ],
      };
      workout.exercises.push(newExercise);
    }

    const updatedWorkout = await workout.save();

    return updatedWorkout;
  } catch (err) {
    throw err;
  }
};


  exports.getAll = async () => {
    const workouts = await Workout.find({})
    return workouts;
  }

  exports.getOne = async (workoutId) => {
    const workout = await Workout.findById(workoutId)
    return workout
  }

  exports.deleteWorkout = async (workoutId) => {
    const workout = await Workout.findByIdAndDelete(workoutId)
    return workout
  }

  exports.editWorkoutName = async (workoutId,newWorkoutName) => {
    const updatedWorkoutName = await Workout.findOneAndUpdate(
        { _id: workoutId },
        { $set: { name: newWorkoutName } },
        { new: true }
    );

    return updatedWorkoutName
  }


  exports.deleteExercise = async (workoutId, exerciseId) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }
  
      const exerciseIndex = workout.exercises.findIndex(
        (exercise) => exercise._id.toString() === exerciseId
      );
  
      if (exerciseIndex === -1) {
        throw new Error('Exercise not found');
      }
  
      // Remove the exercise by its index
      workout.exercises.splice(exerciseIndex, 1);
  
      const updatedWorkout = await workout.save();
  
      return updatedWorkout;
    } catch (err) {
      throw err;
    }
  };


  exports.deleteSet = async (workoutId, exerciseId, setId) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }
  
      const exercise = workout.exercises.find(
        (exercise) => exercise._id.toString() === exerciseId
      );
  
      if (!exercise) {
        throw new Error('Exercise not found');
      }
  
      const setIndex = exercise.sets.findIndex((s) => s._id.toString() === setId);
  
      if (setIndex === -1) {
        throw new Error('Set not found');
      }
  
      // Remove the set from the array
      exercise.sets.splice(setIndex, 1);
  
      const updatedWorkout = await workout.save();
  
      return updatedWorkout;
    } catch (err) {
      throw err;
    }
  };
  
  
  
  
  