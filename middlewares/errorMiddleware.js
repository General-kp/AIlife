const errorHandler = (err, req, res, next) => {
    //Error will be caught here, if it is thrown into the global scope
    console.log(res.statusCode)

    //For token expired error
    if(err.message === 'jwt expired')
        res.status(440)

    //set the status code
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)

    //Return the response
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandler