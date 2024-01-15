# fit-api

## Back-end documentation:

<p>This application is built with Node.js , Express , MongoDB with mongoose , MongoDB Atlas</p>


### Requirements:
- "bcrypt": "^5.1.1",
- "cloudinary": "^1.41.1",
- "cors": "^2.8.5",
- "dotenv": "^16.3.1",
- "express": "^4.18.2",
- "express-hateoas-links": "^1.3.1",
- "jsonwebtoken": "^9.0.2",
- "mongoose": "^7.6.3",
- "multer": "^1.4.5-lts.1",
- "nodemailer": "^6.9.7"


### Configuration:
This application uses `.env` file to store configuration variables.You can create `.env` file in the main directory(next to `package.json` file) of the project and add the following variables:


### Installation:
1. Clone this repository `git clone https://github.com/react-redux-fitbyside/react.git`
2. Go to folder fit-api: `cd fit-api`
3. Install dependencies: `npm install`
4. Make sure you created <strong>.env</strong> file in the main directory and populate it with correct variables
5. Start the server: `npm start`


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
- `GET /users/userSettings` : returns user's selected settings:themeMode : dark/light,weightUnit : kg/lbs,tipsMode : on/off,soundMode : on/off
- `PUT /users/userSettings` : edits user's settings
- `POST /users/:userId/addProgress` : adds progress record for the specified user
- `GET /users/:userId/progress` : returns all progress records for the specified user
- `GET /users/:userId/oneProgress/:progressId` : returns single progress record details
- `DELETE /users/:userId/oneProgress/:progressId` : deletes the specified progress record from the user's list of progress records
- `POST /users/requestResetPassword` : sends confirmation email for resetting password
- `POST /users/resetPassword` : reset user's password and adds the new password
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
<p>Example: {message: "Invalid email or password!" }</p>

### Folder Structure:
- `models` : Contains the database models
- `controllers` : Used for creating the endpoints,handle requests and responses
- `services` : Handle database model operations
- `index.js` : Entry point of the application
