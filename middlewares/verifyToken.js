const jwt = require('jsonwebtoken')

//To be used as the middleware function to validate the token from user with every request
const verifyToken = (req, res, next) => {
    try{
        if(!req.headers.token){
            res.status(401).json({message: "Unauthorized"})
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY
        const verified = jwt.verify(req.headers.token, jwtSecretKey)
        if(verified){
            req.body.userEmail = verified.userEmail
            next()
        }
        else throw new Error('Token expired')
    }catch(err){
        console.log(err.message)
        res.status(401)
        throw new Error(err.message)
    }
}

module.exports = verifyToken