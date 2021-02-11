const express = require('express');
const mongoose = require('mongoose');
const app = express();
const user = require('./routes/user');
const task = require('./routes/task')
const { auth } = require('./verifyToken')
require('dotenv/config');
const cron = require('node-cron');

const {checkTaskDeadline} = require('./checkTaskDeadline')
 
// DB connection
mongoose.connect(process.env.DB_CONNECT, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Finally connected');
},
    err => console.log(err)
)


cron.schedule("38 14 * * *", function () {
    checkTaskDeadline();
    console.log("Running Cron Job");
});

// Middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())


// Routes
app.use(auth)
app.use('/api/users', user)
app.use('/api/tasks', task)
app.get('/', (req, res) => {
    res.send('E don connect?')
})


// Server
app.listen('3000')
