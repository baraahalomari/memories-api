const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();

const postRouter = require('./routes/posts.js');
const userRouter = require('./routes/user.js');

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.use('/post', postRouter);
app.use('/user',userRouter);

app.get('/', (req, res) => {
  res.send('Hello World')
});



mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`)))
  .catch((err) => console.log(err.message))
