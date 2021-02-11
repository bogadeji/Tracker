const cron = require('node-cron');
const {sendMail} = require('./sendDeadlineEmail')
const Task = require('./models/Task.js')

const checkTaskDeadline = async (req, res) => {
        await Task
        .find({completed: false}).populate('user')
        .then(function (unfinishedTasks) {
            taskToNotify = unfinishedTasks.filter((task) => {

                let daysFromCreated = Math.ceil((new Date() - new Date(task.createdAt) )/ 1000 / 60 / 60 / 24)
                let daysLeft = Math.ceil((new Date(task.deadline) - new Date() )/ 1000 / 60 / 60 / 24)
                let notify = (daysLeft <=4 && daysLeft > 0) || ((daysFromCreated % task.notificationFreq) == 0)
                return notify
            })
            if ( taskToNotify.length > 0) {
                sendMail(taskToNotify)
            }
        })
}
module.exports = {checkTaskDeadline};