const router = require('express').Router()
const workoutService = require('../services/workoutService.js')
const {getErrorMessage} = require('../utils/errorMsg.js')

router.get('/', async (req,res) => {
    try {
        const result = await workoutService.getAll()
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.post('/addWorkout',async (req,res) => {
const {workoutName} = req.body;
try {
    const result = await workoutService.createWorkout(workoutName)
    res.status(201).json(result)
} catch (err) {
    res.status(400).json({message: getErrorMessage(err)})
}
})

router.post('/:workoutId/addExercise',async (req,res) => {
const workoutId = req.params.workoutId
const {exerciseImg,exerciseName} = req.body;
const exerciseDetails = {exerciseImg,exerciseName}
try {
    const result = await workoutService.addExerciseToWorkout(workoutId,exerciseDetails)
    res.status(201).json(result)
} catch (err) {
    res.status(400).json({message: getErrorMessage(err)})
}
})

router.post('/:workoutId/addSet', async (req,res) => {
const workoutId = req.params.workoutId
const {nameOfExercise,setNumber,reps,weight,restTime} = req.body;
const setDetails = {setNumber,reps,weight,restTime}
try {
    const result = await workoutService.addSetToExercise(workoutId,nameOfExercise,setDetails)
    res.status(201).json(result)
} catch (err) {
    res.status(400).json({message: getErrorMessage(err)})
}
})

module.exports = router;