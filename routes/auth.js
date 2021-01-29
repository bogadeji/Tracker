const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signinValidation, signupValidation } = require('../validation');


router.post('/signup', async (req, res) => {
    const {error} = signupValidation(req.body)
    if(error) return res.status(400).json({status: 'error', data: {message: error.details[0].message}})
       
    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists) return res.status(400).json({status: 'error', data: {message: 'Email already exists.'}})

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword
    });
     
    try {
        const newUser = await user.save();
        res.json(newUser);
    } catch (err) {
        res.status(400).json({status: 'error', data: {message: err.message}})
    }
})

router.post('/signin', async (req, res) => {
    const {error} = signinValidation(req.body)
    if(error) {
        return res.status(400).json({status: 'error', data:{ message: error.details[0].message}})
    };   

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status().json({status: 'error', data: {message: 'Password or email is invalid'}})

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).json({status: 'error', data: {message: 'Password or email is invalid'}})

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).status(400).json({status: 'success', data: { message: 'User logged in', token, user}})
})

module.exports = router