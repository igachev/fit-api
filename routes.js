const router = require('express').Router()
const userController = require('./controllers/userController.js')
const workoutController = require('./controllers/workoutController.js')
const exerciseController = require('./controllers/exerciseController.js')

router.use('/users',userController)
router.use('/workouts',workoutController)
router.use('/exercises',exerciseController)

module.exports = router;