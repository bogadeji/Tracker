const router = require('express').Router();
const Task = require('../models/Task');


router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).populate('user')
        res.status(200).json({status: 'success', tasks})
    } catch (err) {
        res.status(500).json({status: 'error', error})
    }
})

router.post('/', async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    })

    try {
        const newTask = await task.save()
        res.status(201).json({ status: 'success', newTask})
    } catch (error) {
        res.json({ status: 'error', error })
    }
})

router.get('/:taskId', async (req, res) => {
    try {
        const task = await Task.findById( req.params.taskId)
        res.status(200).json({status: 'success', task})
    } catch(err) {
        res.json({ status: 'error', error})
    }
}) 

router.delete('/:taskId', async (req, res) => {
    try {
        const deletedTask = await Task.remove({ _id: req.params.taskId})
        res.json({ status: 'success', message: 'Task deleted', data: deletedTask})
    } catch (err) {
        res.json({ status: 'error', error})
    }
})

router.patch('/:taskId', async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.taskId},
            {...req.body},
            {new: true}
        )
        res.status(200).json({status: 'success', updatedTask})
    } catch (err) {
        res.json({status: 'error', error})
    }
})

module.exports = router