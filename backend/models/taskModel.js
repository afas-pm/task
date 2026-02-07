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
        color: {
            type: String,
            default: '#3b82f6' // Default blue
        },
        recurrence: {
            type: String,
            enum: ['none', 'daily', 'weekly', 'monthly'],
            default: 'none'
        },
        recurrenceDays: {
            type: [String], // e.g., ['Mon', 'Wed', 'Fri']
            default: []
        },
        tags: {
            type: [String],
            default: []
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
