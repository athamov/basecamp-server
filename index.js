require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressUploader = require('express-fileupload')
var multer = require('multer');
var upload = multer();
const router = require('./router/index.js');
const errorMiddleware = require('./middleware/error-middleware.js');


const PORT = process.env.PORT || process.env.SERVER_PORT || 7000
const app = express();
// app.use(
//   '/api',
//   createProxyMiddleware({
//       target: 'http://localhost:3000',
//       changeOrigin: true,
//       AccessControlAllowOrigin:'*'
//   })
// );
app.use(express.json());  
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin:'*',
  // AccessControlAllowOrigin:'*'
}));
app.use('/api',router); 

app.use(errorMiddleware);
// app.use(expressUploader)
app.use(express.static('public'));

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