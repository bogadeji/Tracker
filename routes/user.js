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

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({status: 'success', users})
    } catch (err) {
        res.status(500).json({status: 'error', err})
    }
})

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById( req.params.userId)
        res.status(200).json({status: 'success', user})
    } catch(err) {
        res.json({ status: 'error', err})
    }
}) 

router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.remove({ _id: req.params.userId})
        res.json({ status: 'success', message: 'User deleted', data: deletedUser})
    } catch (err) {
        res.json({ status: 'error', err})
    }
})

router.patch('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.userId},
            {...req.body},
            {new: true}
        )
        res.status(200).json({status: 'success', updatedUser})
    } catch (err) {
        res.json({status: 'error', err})
    }
})

module.exports = router