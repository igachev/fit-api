const Workout = require('../models/Workout.js')
const Exercise = require('../models/Exercise.js')

exports.createWorkout = async (name,userId) => {
try {
    const workout = new Workout({
        name,
        authorId: userId,
        exercises: [],
      });
  
      const savedWorkout = await workout.save();
      return savedWorkout;
} catch (err) {
    throw err
}
}

exports.addExerciseToWorkout = async (workoutId, exerciseDetails, setDetails,userId) => {
  try {
    const workout = await Workout.findById(workoutId);

    if (!workout) {
      throw new Error('Workout not found');
    }

    const authorId = workout.authorId.toString();
    const isOwner = userId === authorId

    if(!isOwner) {
      throw new Error('only the author of this workout can add exercises')
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


  function convertKgToLbs(weight) {
     let lbs = weight * 2.20462262;
     return lbs
  }

  exports.getAllInLbs = async () => {
    try {
      
      const workouts = await Workout.find({});
  
      workouts.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          exercise.sets.forEach((set) => {
            set.weight = convertKgToLbs(set.weight);
          });
        });
      });
  
      return workouts;
    } catch (err) {
      throw err;
    }
  };

  exports.getOne = async (workoutId) => {
    const workout = await Workout.findById(workoutId)
    return workout
  }

  exports.getOneInLbs = async (workoutId) => {
    const workout = await Workout.findById(workoutId)
    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        set.weight = convertKgToLbs(set.weight);
      });
    });
    return workout;
  }

  exports.deleteWorkout = async (workoutId,userId) => {

    try {
    const workout = await Workout.findById(workoutId);
    const authorId = workout.authorId.toString();
    const isOwner = userId === authorId

    if(!isOwner) {
      throw new Error('only the author of this workout can delete it')
    }
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId)
    return deletedWorkout
    } catch (err) {
      throw err
    }
  }

  exports.editWorkoutName = async (workoutId,newWorkoutName,userId) => {
    try {

    const workout = await Workout.findById(workoutId);
    const authorId = workout.authorId.toString();
    const isOwner = userId === authorId

    if(!isOwner) {
      throw new Error('only the author of this workout can edit it')
    }

      const updatedWorkoutName = await Workout.findOneAndUpdate(
        { _id: workoutId },
        { $set: { name: newWorkoutName } },
        { new: true }
    );

    return updatedWorkoutName
    } catch (err) {
      throw(err)
    }
  }


  exports.deleteExercise = async (workoutId, exerciseId,userId) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }

    const authorId = workout.authorId.toString();
    const isOwner = userId === authorId

    if(!isOwner) {
      throw new Error('only the author of this workout can delete exercises')
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


  exports.deleteSet = async (workoutId, exerciseId, setId,userId) => {
    try {
      const workout = await Workout.findById(workoutId);
  
      if (!workout) {
        throw new Error('Workout not found');
      }

    const authorId = workout.authorId.toString();
    const isOwner = userId === authorId

    if(!isOwner) {
      throw new Error('only the author of this workout can delete sets')
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
  
  
  
  
  