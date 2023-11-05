const express = require('express')
const router = express.Router()

const { SignUp , Login ,SendOtp , VerifyOTP , PasswordReset} = require('../controllers/userController')


//Routing the user authentication requests

//METHOD: POST
//URL: <baseDomain>/api/user/getin
router.route( '/register' ).post(SignUp)

//METHOD: POST
//URL: <baseDomain>/api/user/checkotp
router.route( '/login' ).post(Login)

router.route('/resetotp').post(SendOtp)

router.route('/verifyresetotp').post(VerifyOTP)

router.route('/passwordreset').post(PasswordReset)


module.exports = router