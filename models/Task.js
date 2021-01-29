const { model, Schema } = require('mongoose');

const TaskSchema = new Schema({
    description: {
        type: String,
        required: true,
        min: 6
    },
    completed: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {timestamps: true})

module.exports = new model('Tasks', TaskSchema)