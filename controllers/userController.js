const router = require('express').Router()
const userService = require('../services/userService.js')
const {getErrorMessage} = require('../utils/errorMsg.js')

router.post('/register', async(req,res) => {
    const {email,password} = req.body;

    try {
        const result = await userService.register(email,password)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }

})

router.post('/login', async(req,res) => {
    const {email,password} = req.body;

    try {
        const result = await userService.login(email,password)
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.get('/logout', async(req,res) => {
    res.status(200).json({loggedOut: true})
})

module.exports = router;