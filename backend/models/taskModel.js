import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { 
        type: String,   
        required: true
    },
    description: { 
        type: String,       
        default: ""
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    dueDate: {
        type: Date,
        default: null
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);       
export default Task;
