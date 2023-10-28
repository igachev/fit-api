# fit-api


### Usage:

The server listens on port 5000 by default. Here are the endpoints:


- `POST /users/register` : Creates a new user
- `POST /users/login` : Sign in user with valid information
- `GET /users/logout` : Sign out logged in user
- `GET /workouts` : returns all workouts
- `POST /workouts/addWorkout` : Add new workout and the name of this workout
- `GET /workouts/:workoutId` : Returns a specified workout
- `DELETE /workouts/:workoutId` : Delete specified workout
- `PUT /workouts/:workoutId` : Edit the workout name
- `POST /workouts/:workoutId/addExercise` : Add new exercise to a given workout
- `POST /workouts/:workoutId/addSet` : Add new set to a given exercise
  


### Error Handling:

<p>if there is an error it is returned as { message }</p>


### Folder Structure:
- `models` : Contains the database models
- `controllers` : Used for creating the endpoints,handle requests and responses
- `services` : Handle database model operations
- `index.js` : Entry point of the application
