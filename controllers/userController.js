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
        res.status(200).set('Authorization', `${result.accessToken}`).json(result);
    } catch (err) {
        res.status(400).json({message: getErrorMessage(err)})
    }
})

router.get('/logout', async(req,res) => {
    res.status(200).json({loggedOut: true})
})

router.get('/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const result = await userService.getUserProfile(userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

router.put('/profile/:userId', async (req, res) => {
    try {
      
      const { name, age, height, gender, profilePicture } = req.body;
  
      const userId = req.params.userId;
  
      const result = await userService.updateUserProfile(
        userId,
        name,
        age,
        height,
        gender,
        profilePicture
      );
  
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: getErrorMessage(err) });
    }
  });

module.exports = router;