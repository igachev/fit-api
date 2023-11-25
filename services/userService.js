const User = require('../models/User.js')
const Workout = require('../models/Workout.js')
const jwt = require('../promisifyToken/jsonwebtoken.js')
const SECRET = process.env.JWT_SECRET

exports.register = async (email,password) => {
    const user = await User.findOne({email})

    if(user) {
        throw new Error('User already exists!')
    }

   const newUser = await User.create({email,password})
    return newUser;
}

exports.login = async (email,password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Invalid email or password!')
    }

    const checkPassword = await user.validatePassword(password)

    if(!checkPassword) {
        throw new Error('Invalid email or password!')
    }

    const payload = {_id: user._id, email: user.email};
    const token = await jwt.sign(payload, SECRET,{ expiresIn: '20h' })
    
    return {
        userId: user._id,
        accessToken: token
    }
}

exports.updateUserProfile = async (userId, name, age, height, gender, profilePicture) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            name: name,
            age: age,
            height: height,
            gender: gender,
            profilePicture: profilePicture,
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  exports.getUserProfile = async (userId) => {
    try {
      const user = await User.findById(userId).select('-password'); // Exclude the 'password' field
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  };
 

  exports.addUpcomingWorkout = async (userId, workoutName, date) => {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
  
      const workout = await Workout.findOne({ name: workoutName });
      if (!workout) {
        throw new Error('Workout not found');
      }
  
      const currentDate = new Date();
      const selectedDate = new Date(date);
  
      if (selectedDate.getTime() <= currentDate.getTime()) {
        throw new Error('Date must be in the future');
      }
  
      const upcomingWorkout = {
        workout: { _id: workout._id },
        date: selectedDate, 
      };
  
      const update = {
        $push: {
          upcomingWorkouts: upcomingWorkout,
        },
      };
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
         update, 
        { new: true });
  
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };
  
  exports.getUpcomingWorkouts = async (userId) => {
   try {
    const user = await User.findById(userId).select('-password')
    .populate('upcomingWorkouts.workout');

    if (!user) {
      throw new Error('User not found');
    }

    const currentDate = new Date()

    const upcomingWorkouts = user.upcomingWorkouts
    .filter((workout) => workout.date >= currentDate)
    .sort((a, b) => a.date - b.date);

    return upcomingWorkouts;

   } catch (err) {
    throw err
   } 
 
  }
  
  exports.getCompletedWorkouts = async (userId) => {
 try {
    const user = await User.findById(userId).select('-password')
    .populate('upcomingWorkouts.workout');

    if (!user) {
      throw new Error('User not found');
    }

    const currentDate = new Date()
    const completedWorkouts = user.upcomingWorkouts
    .filter((workout) => workout.date < currentDate)
    .sort((a, b) => a.date - b.date);

    return completedWorkouts;
    
   } catch (err) {
    throw err
   }
  }

  exports.deleteWorkout = async (userId,workoutId) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { upcomingWorkouts: { _id: workoutId } } },
        { new: true }
      )
        .select('-password')
        .populate('upcomingWorkouts.workout');
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  exports.sumSetsByMuscleGroup = async (userId, timePeriod) => {
    try {
      const workouts = await this.getCompletedWorkouts(userId);
      const setsByMuscleGroup = {};
  
      const currentDate = new Date();
  
      let startDate;

      switch (timePeriod) {

        case 'week':
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          break;

        case 'month':
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 1);
          break;

        case 'threeMonths':
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 3);
          break;

        case 'year':
          startDate = new Date(currentDate);
          startDate.setFullYear(currentDate.getFullYear() - 1);
          break;

        default:
          throw new Error('Invalid time period');
      }
  
      for (const workout of workouts) {
        // Check if the workout falls within the specified time period
        if (workout.date >= startDate && workout.date <= currentDate) {
          for (const exercise of workout.workout.exercises) {
            const muscleGroup = exercise.muscleGroup;
            const setsCount = exercise.sets.length;
  
            if (!setsByMuscleGroup[muscleGroup]) {
              setsByMuscleGroup[muscleGroup] = setsCount;
            } else {
              setsByMuscleGroup[muscleGroup] += setsCount;
            }
          }
        }
      }
  
      return setsByMuscleGroup;
    } catch (err) {
      throw err;
    }
  };
  
  exports.getUserWeightUnit = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user.weightUnit;
    } catch (err) {
      throw err;
    }
  };

  exports.updateUserWeightUnit = async (userId, newWeightUnit) => {
    try {
      const update = {
        $set: {
          weightUnit: newWeightUnit,
        },
      };
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        update,
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };
  
  exports.getUserThemeMode = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user.themeMode;
    } catch (err) {
      throw err;
    }
  };

  exports.updateUserThemeMode = async (userId, newThemeMode) => {
    try {
      const update = {
        $set: {
          themeMode: newThemeMode,
        },
      };
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        update,
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };
  
  
  
  
  