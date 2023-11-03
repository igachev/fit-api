const router = require('express').Router()
const exerciseService = require('../services/exerciseService.js')
const {getErrorMessage} = require('../utils/errorMsg.js')

router.get('/', async (req,res) => {
    try {
        const result = await exerciseService.getAll()
        const exercisesWithLinks = result.map((exercise) => ({
            data:exercise,
            links: createExerciseLinks(exercise._id),
          }));
          res.status(200).json(exercisesWithLinks);
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.post('/create',async (req,res) => {

    const {exerciseName,muscleGroup} = req.body;

    try {
        const result = await exerciseService.createExercise(exerciseName,muscleGroup)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.delete('/:exerciseId',async (req,res) => {
    const exerciseId = req.params.exerciseId

    try {
        const result = await exerciseService.deleteExercise(exerciseId)
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})



module.exports = router

function createExerciseLinks(exerciseId) {
    return [
      { rel: 'delete exercise from exercises', method: 'DELETE', href: `/exercises/${exerciseId}` },
      { rel: 'add exercise to exercises', method: 'POST', href: `/exercises/create`}
    ];
  }