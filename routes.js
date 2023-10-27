const router = require('express').Router()
const userController = require('./controllers/userController.js')
const workoutController = require('./controllers/workoutController.js')

router.use('/users',userController)
router.use('/workouts',workoutController)

module.exports = router;