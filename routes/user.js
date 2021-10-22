const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');


const signin = async(req, res) =>{

  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).send('User does not exist');
    const isCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isCorrect) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ email: existingUser.email , id: existingUser._id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).send('something went wrong');
    console.log(error);
  }

}

 const signup = async(req, res) =>{
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) return res.status(404).send('User already exist');
    if (password !== confirmPassword) return res.status(400).send('Invailed login, password does not correct');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    const token = jwt.sign({ email: result.email , id: result._id  }, 'secret', { expiresIn: '1h' })
    res.status(200).json({ result, token })
  } catch (error) {
    res.status(500).send('something went wrong');
    console.log(error);
  }
}

userRouter.post('/signin', signin);
userRouter.post('/signup', signup);

module.exports=userRouter;