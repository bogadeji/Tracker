const express = require('express');
const router = express.Router();
const User = require('../models/User');


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