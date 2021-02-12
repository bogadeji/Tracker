const express = require('express');
const mongoose = require('mongoose');
const app = express();
const user = require('./routes/user');
const task = require('./routes/task')
const authUser = require('./routes/auth')
const { verifyToken } = require('./verifyToken')
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
    console.log('DB connected');
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
app.get('/', (req, res) => {
    res.send('E don connect?')
})
app.use('/api/auth', authUser)
app.use(verifyToken)
app.use('/api/users', user)
app.use('/api/tasks', task)



// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});
