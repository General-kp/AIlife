const mongoose = require('mongoose')

//Method to connect to the database, using the URI specified in the .env file( defined as environment variable)
const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGOOSE_URI)
        console.log(`MongoDB connected: ${ connect.connection.host }`)
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB