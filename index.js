const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/errorMiddleware')

connectDB()

app.use( express.json() )
app.use( express.urlencoded({ extended: false }) )

app.use('/api/user', require('./routes/userRoutes'))

app.use(errorHandler)

const port = process.env.PORT || 5001
app.listen( port, () => console.log(`Server started at port ${port}`) )