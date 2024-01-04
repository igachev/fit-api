const User = require('../models/User.js')
const Workout = require('../models/Workout.js')
const jwt = require('../promisifyToken/jsonwebtoken.js')
const SECRET = process.env.JWT_SECRET
const ResetPasswordToken = require("../models/ResetPasswordToken.js");
const {sendEmail} = require("../utils/sendEmail.js");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const {uploadImage} = require("../utils/uploadImage.js");

exports.register = async (email,password) => {
    const user = await User.findOne({email})

    if(user) {
        throw new Error('User already exists!')
    }

   const newUser = await User.create({email,password})
    return newUser;
}

exports.requestResetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email does not exist");

  let token = await ResetPasswordToken.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  await ResetPasswordToken.create({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  });

  const link = `http://localhost:3000/login?token=${resetToken}&id=${user._id}&popupResetPassword=${true}`;

  return sendEmail(
    email,
    "Password Reset Request",
    {
      name: user.name || "User",
      link: link,
    }
  ).then(data => data)

  
};

exports.resetPassword = async (userId, token, password) => {
  let resetPasswordToken = await ResetPasswordToken.findOne({ userId });

  if (!resetPasswordToken) {
    throw new Error("Invalid or expired password reset token");
  }

  console.log(resetPasswordToken.token, token);

  const isValid = await bcrypt.compare(token, resetPasswordToken.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await bcrypt.hash(password, 10);

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  await resetPasswordToken.deleteOne();

  return { message: "Password reset was successful" };
};

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

exports.googleLogin = async (googleToken) => {
  const { email, name, picture } = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })

  let user = await User.findOne({ email })

  if (!user) {
    const password = Math.random().toString(16).slice(2);
    user = await User.create({ email, password, name, profilePicture: picture})
  }

  const payload = { _id: user._id, email };
  const token = await jwt.sign(payload, SECRET, { expiresIn: '20h' })

  return {
    userId: user._id,
    accessToken: token
  }

}

exports.updateUserProfile = async (userId, name, age, height, gender, weight, profilePicture, image) => {
  try {
    if(image){
      const b64 = Buffer.from(image.buffer).toString("base64");
      const dataURI = "data:" + image.mimetype + ";base64," + b64;
      const {secure_url} = await uploadImage(dataURI);
      profilePicture = secure_url;
    }
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            name: name,
            age: age,
            height: height,
            gender: gender,
            weight: weight,
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
        if (
          workout.date >= startDate &&
          workout.date <= currentDate &&
          workout.workout && // Check if the workout is not deleted
          workout.workout.exercises // Check if exercises are available
        ) {
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
  
  exports.addProgressData = async (userId, measurements) => {
    try {
      const currentDate = new Date();
      const total = calculateTotal(measurements);
  
      const progressData = {
        currentWeight: measurements.currentWeight,
        date: currentDate,
        total,
        upperBody: { ...measurements.upperBody },
        arms: { ...measurements.arms },
        middleBody: { ...measurements.middleBody },
        legs: { ...measurements.legs },
        foldThickness: { ...measurements.foldThickness },
      };
  
      const update = {
        $push: {
          progress: progressData,
        },
        $set: {
          weight: measurements.currentWeight,
        },
      };
  
      const options = { new: true };
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        update,
        options
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser.progress;
    } catch (err) {
      throw err;
    }
  };

  function calculateTotal(measurements) {
    const upperBodyTotal =
      measurements.upperBody.neck +
      measurements.upperBody.shoulders +
      measurements.upperBody.chest;
  
    const armsTotal =
      measurements.arms.arm +
      measurements.arms.forearm +
      measurements.arms.wrist;
  
    const middleBodyTotal =
      measurements.middleBody.waist + measurements.middleBody.hips;
  
    const legsTotal =
      measurements.legs.thigh + measurements.legs.calf + measurements.legs.ankle;
  
    const foldThicknessTotal =
      measurements.foldThickness.abdominal +
      measurements.foldThickness.thigh +
      measurements.foldThickness.triceps +
      measurements.foldThickness.pelvicBone;
  
    return (
      upperBodyTotal +
      armsTotal +
      middleBodyTotal +
      legsTotal +
      foldThicknessTotal
    );
  }
  
  exports.getProgressData = async (userId) => {
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const sortedProgress = user.progress.sort((a, b) => a.date - b.date);
  
      return sortedProgress;
    } catch (err) {
      throw err;
    }
  };

  exports.getOneProgress = async(userId,progressId) => {
    try {

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const progressEntry = user.progress.id(progressId);

    if (!progressEntry) {
      throw new Error('Progress entry not found');
    }

    return progressEntry;

    } catch (err) {
      throw(err)
    }
  }
  
  exports.deleteOneProgress = async (userId, progressId) => {
    try {
      const update = {
        $pull: {
          progress: { _id: progressId },
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

  exports.sumSetsByDateAndMuscleGroup = async (userId, timePeriod) => {
    try {
      const workouts = await this.getCompletedWorkouts(userId);
      const setsByDateAndMuscleGroup = {};
  
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
        if (
          workout.date >= startDate &&
          workout.date <= currentDate &&
          workout.workout && // Check if the workout is not deleted
          workout.workout.exercises // Check if exercises are available
        ) {
          // Format the date to ignore the time component (considering only date)
          const workoutDate = workout.date.toISOString().split('T')[0];
  
          // Initialize the sets count for the date if not exists
          if (!setsByDateAndMuscleGroup[workoutDate]) {
            setsByDateAndMuscleGroup[workoutDate] = {};
          }
  
          // Sum the sets count for each muscle group for the date
          for (const exercise of workout.workout.exercises) {
            const muscleGroup = exercise.muscleGroup;
  
            if (!setsByDateAndMuscleGroup[workoutDate][muscleGroup]) {
              setsByDateAndMuscleGroup[workoutDate][muscleGroup] = 0;
            }
  
            setsByDateAndMuscleGroup[workoutDate][muscleGroup] += exercise.sets.length;
          }
        }
      }
  
      return setsByDateAndMuscleGroup;
    } catch (err) {
      throw err;
    }
  };