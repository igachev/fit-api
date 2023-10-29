# fit-api


### Usage:

The server listens on port 5000 by default. Here are the endpoints:


- `POST /users/register` : Creates a new user
- `POST /users/login` : Sign in user with valid information
- `GET /users/logout` : Sign out logged in user
- `PUT /users/profile/:userId` : add username,age,height,gender,profilePicture to specified user
- `GET /users/profile/:userId` : returns user's details 
- `GET /workouts` : returns all workouts
- `POST /workouts/addWorkout` : Add new workout and the name of this workout
- `GET /workouts/:workoutId` : Returns a specified workout
- `DELETE /workouts/:workoutId` : Delete specified workout
- `PUT /workouts/:workoutId` : Edit the workout name
- `POST /workouts/:workoutId/addExercise` : Add new exercise to a given workout
- `GET /workouts/:workoutId/exercises/:exerciseId` : returns specified exercise from given workout
- `PUT /workouts/:workoutId/exercises/:exerciseId` : edits specified exercise from given workout
- `DELETE /workouts/:workoutId/exercises/:exerciseId` : removes specified exercise from given workout
- `POST /workouts/:workoutId/exercises/:exerciseId/addSet` : Add new set to a given exercise
- `GET /workouts/:workoutId/exercises/:exerciseId/sets/:setId` : return single set from given exercise
- `DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:setId` : delete set from given exercise 
  


### Error Handling:

<p>if there is an error it is returned as { message }</p>


### Folder Structure:
- `models` : Contains the database models
- `controllers` : Used for creating the endpoints,handle requests and responses
- `services` : Handle database model operations
- `index.js` : Entry point of the application
