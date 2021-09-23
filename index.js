const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();

const postRouter= require('./routes/posts.js');


app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use('/post',postRouter);

app.get('/',(req,res)=>{
  res.send('Hello World')
});

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then (()=> app.listen(PORT, () => console.log(`Server started on ${PORT}`)))
.catch((err)=> console.log(err.message))
