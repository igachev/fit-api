const router = require('express').Router()
const userService = require('../services/userService.js')
const {getErrorMessage} = require('../utils/errorMsg.js')
const Multer = require("multer");
const upload = Multer({
  storage: new Multer.memoryStorage()
});

router.post('/register', async(req,res) => {
    const {email,password} = req.body;

    try {
        const result = await userService.register(email,password)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }

})

router.post('/login', async(req,res) => {
    const {email,password} = req.body;

    try {
        const result = await userService.login(email,password)
        res.status(200).set('Authorization', `${result.accessToken}`).json(result);
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.post('/googleLogin', async(req,res) => {
  const { access_token } = req.body;

  try {
      const result = await userService.googleLogin(access_token)
      res.status(200).json(result)
  } catch (err) {
      res.status(400).json({message: getErrorMessage(err)})
  }

})

router.get('/logout', async(req,res) => {
    res.status(200).json({loggedOut: true})
})

router.get('/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getUserProfile(userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  router.put('/profile/:userId', upload.single("image"), async (req, res) => {
    try {
      const image = req.file;
      const { name, age, height, gender, weight, profilePicture } = JSON.parse(req.body.data);
  
      const userId = req.params.userId;
  
      const result = await userService.updateUserProfile(
        userId,
        name,
        age,
        height,
        gender,
        weight,
        profilePicture,
        image
      );
  
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  router.post('/:userId/addUpcomingWorkout',async (req,res) => {
    try {
      const userId = req.params.userId;
      const {workoutName,date} = req.body;
      const result = await userService.addUpcomingWorkout(userId,workoutName,date)
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.get('/:userId/getUpcomingWorkouts', async (req,res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getUpcomingWorkouts(userId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.get('/:userId/getCompletedWorkouts', async (req,res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getCompletedWorkouts(userId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.delete('/:userId/workouts/:workoutId',async (req,res) => {
    try {
      const userId = req.params.userId;
      const workoutId = req.params.workoutId;
      const result = await userService.deleteWorkout(userId,workoutId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.get('/:userId/totalSets',async (req,res) => {
    try {
      const userId = req.params.userId;
      const timePeriod = req.query.timePeriod
      const result = await userService.sumSetsByMuscleGroup(userId,timePeriod)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.get('/:userId/totalSetsByDate', async (req,res) => {
    try {
      const userId = req.params.userId;
      const timePeriod = req.query.timePeriod
      const result = await userService.sumSetsByDateAndMuscleGroup(userId,timePeriod)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.get('/:userId/weightUnit', async (req,res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getUserWeightUnit(userId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.put('/:userId/weightUnit', async (req, res) => {
    const userId = req.params.userId;
    const newWeightUnit = req.query.newWeightUnit;
  
    try {
      const updatedUser = await userService.updateUserWeightUnit(userId, newWeightUnit);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  router.get('/:userId/themeMode', async (req,res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getUserThemeMode(userId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.put('/:userId/themeMode', async (req, res) => {
    const userId = req.params.userId;
    const newThemeMode = req.query.newThemeMode;
  
    try {
      const updatedUser = await userService.updateUserThemeMode(userId, newThemeMode);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  router.get('/:userId/soundMode', async (req,res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getUserSoundMode(userId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.put('/:userId/soundMode', async (req, res) => {
    const userId = req.params.userId;
    const newSoundMode = req.query.newSoundMode;
  
    try {
      const updatedUser = await userService.updateUserSoundMode(userId, newSoundMode);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  router.post('/:userId/addProgress', async (req, res) => {
    try {
      const userId = req.params.userId;
      const {measurements} = req.body;
     // console.log(measurements)
      const result = await userService.addProgressData(userId, measurements);
  
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  router.get('/:userId/progress', async (req,res) => {
    const userId = req.params.userId;
    try {
      const result = await userService.getProgressData(userId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.get('/:userId/oneProgress/:progressId', async (req,res) => {
    const {userId,progressId} = req.params;
    try {
      const result = await userService.getOneProgress(userId,progressId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.delete('/:userId/oneProgress/:progressId', async (req,res) => {
    const {userId,progressId} = req.params;
    try {
      const result = await userService.deleteOneProgress(userId,progressId)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  })

  router.post('/requestResetPassword', async(req,res) => {
    const {email} = req.body;
    console.log(req)

    try {
        const result = await userService.requestResetPassword(email)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.post('/resetPassword', async(req, res) => {
  const {userId, token, password} = req.body;

  try {
      const result = await userService.resetPassword(userId, token, password)
      res.status(200).json(result);
  } catch (err) {
      res.status(400).json({message: getErrorMessage(err)})
  }
})

module.exports = router;