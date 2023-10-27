require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const setupDatabase = require('./config/initDatabase.js')
const routes = require('./routes.js')

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(routes)

setupDatabase()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server started...`);
    })
})