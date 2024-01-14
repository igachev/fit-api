# fit-api


### Usage:

The server listens on port 5000 by default. Here are the endpoints:


- `POST /users/register` : Creates a new user
- `POST /users/login` : Sign in user with valid information
- `POST /users/googleLogin` : Sign in with google profile
- `GET /users/logout` : Sign out logged in user
- `PUT /users/profile/:userId` : add username,age,height,gender,profilePicture,weight,weightUnit to specified user
- `GET /users/profile/:userId` : returns user's profile details-username,age,height,gender,profilePicture,weight,weightUnit
- `POST /users/:userId/addUpcomingWorkout` : add upcoming workout for specificied user in the list of upcoming workouts
- `GET /users/:userId/getUpcomingWorkouts` : returns all upcoming workouts for the specified user
- `GET /users/:userId/getCompletedWorkouts` : returns all completed workouts for specified user and use them as user's workout history
- `DELETE /users/:userId/workouts/:workoutId` : delete upcoming or completed workout for the specified user
- `GET /users/:userId/totalSets?timePeriod=week` : returns total sets for each muscle group which are done within the last week (use them in history diagram)
- `GET /users/:userId/totalSets?timePeriod=month` : returns total sets for each muscle group which are done within the last month (use them in history diagram)
- `GET /users/:userId/totalSets?timePeriod=threeMonths` : returns total sets for each muscle group which are done within the last three months (use them in history diagram)
- `GET /users/:userId/totalSets?timePeriod=year` : returns total sets for each muscle group which are done within the last year (use them in history diagram)
- `GET /users/:userId/totalSetsByDate?timePeriod=week` : returns object which contains the date of the completed workout and total sets for each muscle group within the last week (use them in progress diagram)
- `GET /users/:userId/totalSetsByDate?timePeriod=month` : returns object which contains the date of the completed workout and total sets for each muscle group within the last month (use them in progress diagram)
- `GET /users/:userId/totalSetsByDate?timePeriod=threeMonths` : returns object which contains the date of the completed workout and total sets for each muscle group within the last three months (use them in progress diagram)
- `GET /users/:userId/totalSetsByDate?timePeriod=year` : returns object which contains the date of the completed workout and total sets for each muscle group within the last year (use them in progress diagram)
- `GET /workouts` : returns all workouts
- `POST /workouts/addWorkout` : Add new workout and the name of this workout
- `GET /workouts/:workoutId` : Returns a specified workout
- `DELETE /workouts/:workoutId` : Delete specified workout
- `PUT /workouts/:workoutId` : Edit the workout name
- `POST /workouts/:workoutId/addExercise` : Add new exercise with set details to a given workout.If the exercise already exists in the workout it only adds the sets.
- `GET /workouts/:workoutId/filteredExercises?muscleGroup=`: returns exercises filtered by muscle group for a given workout
- `DELETE /workouts/:workoutId/exercises/:exerciseId` : removes specified exercise from given workout
- `DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:setId` : delete set from given exercise 
  


### Error Handling:

<p>if there is an error it is returned as { message }</p>


### Folder Structure:
- `models` : Contains the database models
- `controllers` : Used for creating the endpoints,handle requests and responses
- `services` : Handle database model operations
- `index.js` : Entry point of the application
