require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index.js');
const errorMiddleware = require('./middleware/error-middleware.js')

const PORT = process.env.SERVER_PORT || 7000
const app = express();
 
app.use(express.json());  
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin:process.env.CLIENT_URL
}));
app.use('/api',router); 

app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL,{ 
      useNewUrlParser: true
    })    
    app.listen(PORT,console.log("server has been started in ",PORT));
    console.log("mongodb status: " + mongoose.connection.readyState);
  }
  catch (err) {
    console.log(err)
  }
} 

start()