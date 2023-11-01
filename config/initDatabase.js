const mongoose = require('mongoose')
require("dotenv").config();

async function setupDatabase() {
    mongoose.set('strictQuery',false)
   // await mongoose.connect(process.env.DATABASE_DEVELOPMENT)
     await mongoose.connect(process.env.DATABASE_PRODUCTION)
    console.log('db connected');
}

module.exports = setupDatabase