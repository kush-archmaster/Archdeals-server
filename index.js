require('dotenv').config();
const express = require('express');
require('./db/conn');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const PORT = process.env.PORT || 4000;

const app = express()

//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}));


//routes
app.use('/user', require('./routes/userRoutes'));  //so path it will go on will be /user/register for registering
app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/uploadImg'));


app.get('/' ,(req,res) =>{
    res.send('Hello')
})


app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})