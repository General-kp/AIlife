const jwt = require('jsonwebtoken')

const { transporter } = require('../services/mailConfig')

//Generating a 6 digit otp
const generateOtp = () => {
    let result = "";

    for (let i = 1; i <= 6; i++) {
      result += Math.floor(Math.random() * 10);
    }

    return result;
}

//Generating the token while Getting In to the application
const generateResetToken = (userEmail, otp) => {
    try{
        //This is the secretkey used to encrypt
        const jwtSecretKey = process.env.JWT_SECRET_KEY

        //Data which will be encrypted
        const data = {
            time: Date.now(),
            userEmail: userEmail,
            otp: otp
        }

        //Generate the JWT (expire time for opt will be 2 minutes (120s))
        const token = jwt.sign(data, jwtSecretKey, {expiresIn: '120s'})
        return token
    }catch(err){
        throw new Error('Something went wrong')
    }
}

//Verify the Get In token
const verifyResetToken = (token) => {
    try{
        const jwtSecretKey = process.env.JWT_SECRET_KEY

        //jwt.verify() will throw an error, if the token is expired
        const verified = jwt.verify(token, jwtSecretKey)
        if(verified){
            return { userEmail: verified.userEmail, otp: verified.otp }
        }

        //If jwt.verify() doesn't throws, throw exception here
        throw new Exception('jwt expired')
    }catch(err){
        console.log(err.message)
        throw new Error(err.message)
    }
}

//Generate the actual token which will be stored in the localStorage of the application
//This token will be generated only after thye successful otp verification
const generateToken = (userEmail) => {
    try{
        //SecretKey and data to be encrypted
        const jwtSecretKey = process.env.JWT_SECRET_KEY
        const data = {
            time: Date(),
            userEmail: userEmail
        }

        const token = jwt.sign(data, jwtSecretKey)
        return token
    }catch(err){
        console.log(err.message)
        throw new Error('Something went wrong')
    }
}

//Sending the OTP mail to the user
const sendMail = (req, res, user) =>{
    try{
        //Define the mail options
        const mailOptions = {
            from: process.env.email,
            to: req.body.userEmail,
            subject: user.subject,
            text: user.message,
        }

        //Sending the mail using the transporter
        transporter.sendMail(mailOptions, (err, info) =>{
            if(err){
                    console.log(err)
                    return res.status(500).json({message: "Some error occured in the server", status: 500})
            }
            return res.status(200).json({message: "OTP sent successfully", token: user.token})
        })
    }

    catch(err){
        res.status(500)
        throw new Error(err.message)
    }
}

module.exports = {
    generateOtp,
    generateResetToken,
    verifyResetToken,
    generateToken,
    sendMail
}