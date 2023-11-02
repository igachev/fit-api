# fit-api


### Usage:

The server listens on port 5000 by default. Here are the endpoints:


- `POST /users/register` : Creates a new user
- `POST /users/login` : Sign in user with valid information
- `GET /users/logout` : Sign out logged in user
- `PUT /users/profile/:userId` : add username,age,height,gender,profilePicture to specified user
- `GET /users/profile/:userId` : returns user's details
- `POST /exercises/create` : add new exercise
- `GET /exercises` : returns all exercises
- `DELETE /exercises/:exerciseId` : delete exercise 
- `GET /workouts` : returns all workouts
- `POST /workouts/addWorkout` : Add new workout and the name of this workout
- `GET /workouts/:workoutId` : Returns a specified workout
- `DELETE /workouts/:workoutId` : Delete specified workout
- `PUT /workouts/:workoutId` : Edit the workout name
- `POST /workouts/:workoutId/addExercise` : Add new exercise with set details to a given workout.If the exercise already exists in the workout it only adds the sets.
- `GET /workouts/:workoutId/filteredExercises?muscleGroup=`: returns exercises filtered by muscle group
- `DELETE /workouts/:workoutId/exercises/:exerciseId` : removes specified exercise from given workout
- `DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:setId` : delete set from given exercise 
  


### Error Handling:

<p>if there is an error it is returned as { message }</p>


### Folder Structure:
- `models` : Contains the database models
- `controllers` : Used for creating the endpoints,handle requests and responses
- `services` : Handle database model operations
- `index.js` : Entry point of the application
