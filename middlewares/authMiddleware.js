const jwt = require('../promisifyToken/jsonwebtoken.js');
const SECRET = process.env.JWT_SECRET


exports.authentication = async (req,res,next) => {
    if(req.headers['Authorization'] !== undefined) {
  const token = req.headers['Authorization']
  if(token) {
        try {
            const decodedToken = await jwt.verify(token,SECRET);
            req.user = decodedToken;
           // console.log(req.user)
        } catch (err) {
            res.status(401).json({message: 'Invalid token'})
            return
        }
  }
    }
    next()
}