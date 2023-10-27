const Workout = require('../models/Workout.js')

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

exports.addExerciseToWorkout = async (workoutId, exerciseDetails) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }
  
      workout.exercises.push({
        exerciseImg: exerciseDetails.exerciseImg,
        exerciseName: exerciseDetails.exerciseName,
        sets: [],
      });
  
      const updatedWorkout = await workout.save();
  
      return updatedWorkout;
    } catch (err) {
      throw err;
    }
  };

  exports.addSetToExercise = async (workoutId, exerciseName, setDetails) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }
  
      const exercise = workout.exercises.find(
        (exercise) => exercise.exerciseName === exerciseName
      );
  
      if (!exercise) {
        throw new Error('Exercise not found');
      }
  
      exercise.sets.push({
        setNumber: setDetails.setNumber,
        reps: setDetails.reps,
        weight: setDetails.weight,
        restTime: setDetails.restTime,
      });
  
      const updatedWorkout = await workout.save();
  
      return updatedWorkout;
    } catch (err) {
      throw err;
    }
  };

  exports.getAll = async () => {
    const workouts = await Workout.find({})
    return workouts
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