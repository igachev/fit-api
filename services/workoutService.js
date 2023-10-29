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

  exports.addSetToExercise = async (workoutId, exerciseId, setDetails) => {
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

  exports.getExerciseById = async (workoutId, exerciseId) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }
  
      const exercise = workout.exercises.id(exerciseId);
  
      if (!exercise) {
        throw new Error('Exercise not found');
      }
  
      return exercise;
    } catch (err) {
      throw err;
    }
  };

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

  exports.editExercise = async (workoutId, exerciseId, exerciseDetails) => {
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
  
      exercise.exerciseImg = exerciseDetails.newExerciseImg;
      exercise.exerciseName = exerciseDetails.newExerciseName;
  
      const updatedWorkout = await workout.save();
  
      return updatedWorkout;
    } catch (err) {
      throw err;
    }
  };
 
  exports.getSet = async (workoutId, exerciseId, setId) => {
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
  
      const set = exercise.sets.find((s) => s._id.toString() === setId);
  
      if (!set) {
        throw new Error('Set not found');
      }
  
      return set;
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
  
  
  
  
  