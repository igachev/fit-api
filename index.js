require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const setupDatabase = require('./config/initDatabase.js')

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

setupDatabase()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server started...`);
    })
})