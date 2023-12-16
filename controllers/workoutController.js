const router = require('express').Router()
const workoutService = require('../services/workoutService.js')
const exerciseService = require('../services/exerciseService.js')
const userService = require('../services/userService.js')
const {getErrorMessage} = require('../utils/errorMsg.js')

router.get('/', async (req,res) => {
 
    try {
      const userId = req.user?._id;
      let userUnit;
      let result;

      if(userId) {
         userUnit = await userService.getUserWeightUnit(userId)
         if(userUnit === 'lbs') {
          result = await workoutService.getAllInLbs()
         }
         else if(userUnit === 'kg') {
          result = await workoutService.getAll()
         }
      }
      else  {
        result = await workoutService.getAll()
      }

        
        const workoutsWithLinks = result.map((workout) => ({
          data:workout,
          links: createWorkoutLinks(workout._id),
        }));
        res.status(200).json(workoutsWithLinks);
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


router.get('/:workoutId', async (req,res) => {
    const workoutId = req.params.workoutId;
    try {
      const userId = req.user?._id;
      let userUnit;
      let result;

      if(userId) {
         userUnit = await userService.getUserWeightUnit(userId)
         if(userUnit === 'lbs') {
          result = await workoutService.getOneInLbs(workoutId)
         }
         else if(userUnit === 'kg') {
          result = await workoutService.getOne(workoutId)
         }
      }
      else  {
        result = await workoutService.getOne(workoutId)
      }
        let exerciseLinks = createExerciseLinks(workoutId,result.exercises?.[0]?._id,
          result.exercises?.[0]?.sets?.[0]?._id)
        res.status(200).json(result,exerciseLinks)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.get('/:workoutId/filteredExercises', async (req,res) => {
  const workoutId = req.params.workoutId;
  let { muscleGroup } = req.query;
  try {
    const result = await exerciseService.filterByMuscleGroup(muscleGroup)
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({message: getErrorMessage(err)})
  }

})

router.post('/:workoutId/addExercise',async (req,res) => {
  const workoutId = req.params.workoutId
  const {nameOfExercise,nameOfMuscleGroup,setNumber,reps,weight,restTime} = req.body;
  const exerciseDetails = {nameOfExercise,nameOfMuscleGroup}
  const setDetails = {setNumber,reps,weight,restTime}
  try {
      const result = await workoutService.addExerciseToWorkout(workoutId,exerciseDetails,setDetails)
      
      res.status(201).json(result);
  
  } catch (err) {
      res.status(400).json({message: getErrorMessage(err)})
  }
  })

router.delete('/:workoutId', async (req,res) => {
    const workoutId = req.params.workoutId;
    try {
        const result = await workoutService.deleteWorkout(workoutId)
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.put('/:workoutId', async (req,res) => {
    const workoutId = req.params.workoutId;
    const {newWorkoutName} = req.body;
    try {
        const result = await workoutService.editWorkoutName(workoutId,newWorkoutName)
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})



router.delete('/:workoutId/exercises/:exerciseId', async (req, res) => {
    const { workoutId, exerciseId } = req.params;
    try {
      const result = await workoutService.deleteExercise(workoutId, exerciseId);
      res.status(200).json(result);
     
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  

router.delete('/:workoutId/exercises/:exerciseId/sets/:setId', async (req, res) => {
    const { workoutId, exerciseId, setId } = req.params;
    try {
      const result = await workoutService.deleteSet(workoutId, exerciseId, setId);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

  

module.exports = router;

function createWorkoutLinks(workoutId) {
  return [
    { rel: 'get Workout', method: 'GET', href: `/workouts/${workoutId}` },
    { rel: 'delete Workout', method: 'DELETE', href: `/workouts/${workoutId}` },
    { rel: 'edit Workout', method: 'PUT', href: `/workouts/${workoutId}` },
    {rel: 'add Workout', method: 'POST', href: `/workouts/addWorkout`}
  ];
}

function createExerciseLinks(workoutId, exerciseId,setId) {
  return [
    { rel: 'add Exercise to given workout', method: 'POST', href: `/workouts/${workoutId}/addExercise` },
    { rel: 'delete Exercise from given workout', method: 'DELETE', href: `/workouts/${workoutId}/exercises/${exerciseId}` },
    { rel: 'returns filtered Exercises by specific muscle group',method:"GET", href: `/workouts/${workoutId}/filteredExercises?muscleGroup=legs`},
    {rel: 'delete a set from given exercise',method:'DELETE',href: `/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`}
  ];
}